from fastapi import FastAPI, Depends, HTTPException, Body, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .database import engine, Base, get_db
# Đảm bảo bạn đã có file auth.py trong cùng thư mục app
from . import crud, schemas, models, utils, auth 
from .config import settings

app = FastAPI(title="Online Quiz API")

# Cấu hình CORS để Frontend gọi được API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Khi deploy thật nên đổi thành domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get(settings.API_PREFIX + "/health")
async def health():
    return {"status": "ok"}

# =======================================================
# 1. AUTH ROUTES (Đăng ký / Đăng nhập)
# =======================================================

@app.post(settings.API_PREFIX + "/register", response_model=schemas.UserOut)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Kiểm tra username trùng
    res = await db.execute(select(models.User).where(models.User.username == user.username))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Username already registered")
    # Kiểm tra email trùng (Quan trọng)
    res_email = await db.execute(select(models.User).where(models.User.email == user.email))
    if res_email.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    
    new_user = models.User(username=user.username, password_hash=hashed_pw, full_name=user.full_name,email=user.email, phone_number=user.phone_number)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.post(settings.API_PREFIX + "/login", response_model=schemas.Token)
async def login(form_data: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    # 1. Tìm user trong DB
    res = await db.execute(select(models.User).where(models.User.username == form_data.username))
    user = res.scalars().first()
    
    # 2. Kiểm tra mật khẩu
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    # 3. Tạo Token (nhúng thêm role vào payload của token)
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    
    # 4. TRẢ VỀ KẾT QUẢ ĐẦY ĐỦ (Token + Role + Username)
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role,       
        "username": user.username,
        "email": user.email,               # <--- Trả về
        "phone_number": user.phone_number  # <--- Trả về
    }

# =======================================================
# 2. STUDENT / PUBLIC ROUTES (Làm bài thi)
# =======================================================

# API Tạo câu hỏi (Dùng chung cho cả Admin khi thêm mới)
@app.post(settings.API_PREFIX + "/questions", response_model=schemas.QuestionWithAnswer)
async def create_question(q: schemas.QuestionCreate, db: AsyncSession = Depends(get_db)):
    # Lưu ý: Trong thực tế nên check quyền Admin ở đây, nhưng để đơn giản ta tạm mở
    return await crud.create_question(db, q)

# API Lấy đề thi ngẫu nhiên (Cho sinh viên làm bài)
@app.get(settings.API_PREFIX + "/questions/random", response_model=list[schemas.QuestionOut])
async def get_random(limit: int = 10, category: str = None, difficulty: str = None, db: AsyncSession = Depends(get_db)):
    rows = await crud.get_random_questions(db, limit=limit, category=category, difficulty=difficulty)
    return [schemas.QuestionOut.model_validate(r) for r in rows]

# API Nộp bài (Yêu cầu đăng nhập)
@app.post(settings.API_PREFIX + "/submit")
async def submit_answers(
    payload: dict = Body(...), 
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user) # Bắt buộc có Token
):
    answers = payload.get("answers", {})
    try:
        qids = list(map(int, answers.keys()))
    except ValueError:
        return {"total": 0}
        
    questions = []
    for qid in qids:
        q = await crud.get_question_by_id(db, qid)
        if q:
            questions.append(q)
            
    # Chấm điểm
    result_data = utils.grade(questions, answers)
    
    # Lưu kết quả vào Database
    exam_history = models.ExamResult(
        user_id=current_user.id,
        score=result_data["score"],
        total_questions=result_data["total"],
        correct_answers=result_data["correct"],
        detail_history=result_data["details"]
    )
    db.add(exam_history)
    await db.commit()
    
    return result_data

# API Lấy bảng xếp hạng (Top 10)
@app.get(settings.API_PREFIX + "/leaderboard")
async def get_leaderboard_route(db: AsyncSession = Depends(get_db)):
    return await crud.get_leaderboard(db)

# API Xem lịch sử thi của chính mình
@app.get(settings.API_PREFIX + "/history", response_model=list[schemas.ExamResultOut])
async def get_my_history(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return await crud.get_user_history(db, current_user.id)


# =======================================================
# 3. ADMIN ROUTES (Quản lý - Chỉ Admin được gọi)
# =======================================================

# 3.1 Thống kê Dashboard
@app.get(settings.API_PREFIX + "/admin/stats")
async def admin_stats(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await crud.get_stats(db)

# 3.2 Lấy danh sách tất cả câu hỏi (kèm đáp án để sửa)
@app.get(settings.API_PREFIX + "/admin/questions", response_model=list[schemas.QuestionWithAnswer])
async def admin_get_questions(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await crud.get_all_questions(db)

# 3.3 Xóa câu hỏi
@app.delete(settings.API_PREFIX + "/admin/questions/{qid}")
async def admin_delete_question(qid: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    success = await crud.delete_question(db, qid)
    if not success: raise HTTPException(status_code=404, detail="Question not found")
    return {"status": "deleted"}

# 3.4 Cập nhật câu hỏi
@app.put(settings.API_PREFIX + "/admin/questions/{qid}")
async def admin_update_question(qid: int, q: schemas.QuestionCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    updated_q = await crud.update_question(db, qid, q)
    if not updated_q: raise HTTPException(status_code=404, detail="Question not found")
    return updated_q

# 3.5 Lấy danh sách người dùng
@app.get(settings.API_PREFIX + "/admin/users", response_model=list[schemas.UserOut])
async def admin_get_users(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await crud.get_all_users(db)

# 3.6 Xem lịch sử thi của một người dùng bất kỳ
@app.get(settings.API_PREFIX + "/admin/users/{user_id}/history", response_model=list[schemas.ExamResultOut])
async def admin_get_user_history(user_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    return await crud.get_user_history(db, user_id)

# 3.7 Xóa người dùng
@app.delete(settings.API_PREFIX + "/admin/users/{user_id}")
async def admin_delete_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền")
    
    # Không cho xóa chính mình
    if user_id == current_user.id: raise HTTPException(status_code=400, detail="Không thể xóa tài khoản của chính mình")
    
    success = await crud.delete_user(db, user_id)
    if not success: raise HTTPException(status_code=404, detail="User not found")
    return {"status": "deleted"}

# 3.8 Cập nhật thông tin/role người dùng
@app.put(settings.API_PREFIX + "/admin/users/{user_id}")
async def admin_update_user(user_id: int, new_data: schemas.UserOut, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền")

    updated_user = await crud.update_user_role(db, user_id, new_data.role, new_data.full_name)
    if not updated_user: raise HTTPException(status_code=404, detail="User not found")
    return updated_user