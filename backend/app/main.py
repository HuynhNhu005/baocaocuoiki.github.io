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
@app.post(settings.API_PREFIX + "/questions", response_model=schemas.QuestionOut)
async def create_question(question: schemas.QuestionCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # SỬA DÒNG NÀY: Cho phép cả admin VÀ teacher
    if current_user.role not in ["admin", "teacher"]: 
        raise HTTPException(status_code=403, detail="Bạn không có quyền thêm câu hỏi")
        
    return await crud.create_question(db, question)

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
    
    # --- SỬA DÒNG NÀY ---
    # Cũ: if current_user.role != "admin": ...
    # Mới: Cho phép cả ADMIN và TEACHER
    if current_user.role not in ["admin", "teacher"]: 
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
        
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
    # --- SỬA ĐOẠN NÀY ---
    # Cũ: if current_user.role != "admin": ...
    # Mới: Cho phép cả "admin" và "teacher"
    if current_user.role not in ["admin", "teacher"]: 
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
        
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

# =======================================================
# 4. CLASS MANAGEMENT ROUTES (Admin & Teacher)
# =======================================================

# 4.1 Tạo lớp học (Chỉ Admin)
@app.post(settings.API_PREFIX + "/admin/classes", response_model=schemas.ClassOut)
async def create_class_route(c: schemas.ClassCreate, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Chỉ Admin mới được tạo lớp")
    
    new_cls = await crud.create_class(db, c)
    if not new_cls:
        raise HTTPException(status_code=400, detail="Mã lớp (Code) đã tồn tại")
    return new_cls

# 4.2 Lấy danh sách lớp
@app.get(settings.API_PREFIX + "/admin/classes", response_model=list[schemas.ClassOut])
async def get_classes_route(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    # Teacher cũng có thể xem danh sách lớp (sau này sẽ lọc chỉ lớp mình dạy)
    if current_user.role not in ["admin", "teacher"]: raise HTTPException(status_code=403, detail="Không có quyền")
    return await crud.get_all_classes(db)

# 4.3 Thêm học sinh vào lớp
@app.post(settings.API_PREFIX + "/admin/classes/{class_id}/students")
async def add_student_route(class_id: int, payload: schemas.AddStudentToClass, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role not in ["admin", "teacher"]: raise HTTPException(status_code=403, detail="Không có quyền")
    
    result = await crud.add_student_to_class(db, class_id, payload.student_username)
    if result == "class_not_found": raise HTTPException(status_code=404, detail="Lớp không tồn tại")
    if result == "student_not_found": raise HTTPException(status_code=404, detail="Không tìm thấy học sinh này")
    if result == "already_in_class": raise HTTPException(status_code=400, detail="Học sinh đã ở trong lớp này rồi")
    
    return {"status": "success", "message": f"Đã thêm {payload.student_username} vào lớp"}
# 4.4 Gán Giáo viên cho lớp (Chỉ Admin)
@app.post(settings.API_PREFIX + "/admin/classes/{class_id}/assign_teacher")
async def assign_teacher_route(
    class_id: int, 
    payload: dict = Body(...), # Body gửi lên: {"teacher_id": 5}
    db: AsyncSession = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Quyền hạn bị từ chối")
    
    teacher_id = payload.get("teacher_id")
    success = await crud.assign_teacher_to_class(db, class_id, teacher_id)
    if not success: raise HTTPException(status_code=404, detail="Lớp học không tồn tại")
    
    return {"status": "success", "message": "Đã phân công giáo viên chủ nhiệm"}
# THÊM API XÓA SINH VIÊN KHỎI LỚP
@app.delete(settings.API_PREFIX + "/admin/classes/{class_id}/students/{student_id}")
async def remove_student_route(class_id: int, student_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin": raise HTTPException(status_code=403, detail="Không có quyền")
    await crud.remove_student_from_class(db, class_id, student_id)
    return {"status": "removed"}

# =======================================================
# 5. TEACHER ROUTES (Dành riêng cho Giáo viên)
# =======================================================

@app.get(settings.API_PREFIX + "/teacher/my-classes", response_model=list[schemas.ClassOut])
async def get_my_classes_route(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "teacher": 
        raise HTTPException(status_code=403, detail="Bạn không phải là Giáo viên")
    return await crud.get_teacher_classes(db, current_user.id)

# API Xem bảng điểm lớp
@app.get(settings.API_PREFIX + "/teacher/classes/{class_id}/gradebook")
async def get_class_gradebook_route(class_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "teacher": raise HTTPException(status_code=403, detail="Không có quyền")
    return await crud.get_class_gradebook(db, class_id)

# API Ra đề thi (Giả lập để frontend chạy mượt)
@app.post(settings.API_PREFIX + "/teacher/exams")
async def create_exam_route(payload: dict = Body(...), current_user: models.User = Depends(auth.get_current_user)):
    # Sau này bạn có thể lưu vào Database thật
    return {"status": "success", "message": f"Đã tạo bài thi: {payload.get('title')}"}