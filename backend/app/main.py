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

# --- AUTH ROUTES (Đăng ký / Đăng nhập) ---
@app.post(settings.API_PREFIX + "/register", response_model=schemas.UserOut)
async def register(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    # Kiểm tra username trùng
    res = await db.execute(select(models.User).where(models.User.username == user.username))
    if res.scalars().first():
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pw = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, password_hash=hashed_pw, full_name=user.full_name)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

@app.post(settings.API_PREFIX + "/login", response_model=schemas.Token)
async def login(form_data: schemas.UserLogin, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.User).where(models.User.username == form_data.username))
    user = res.scalars().first()
    
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# --- QUESTION ROUTES ---
@app.post(settings.API_PREFIX + "/questions", response_model=schemas.QuestionWithAnswer)
async def create_question(q: schemas.QuestionCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_question(db, q)

@app.get(settings.API_PREFIX + "/questions/random", response_model=list[schemas.QuestionOut])
async def get_random(limit: int = 10, category: str = None, difficulty: str = None, db: AsyncSession = Depends(get_db)):
    rows = await crud.get_random_questions(db, limit=limit, category=category, difficulty=difficulty)
    return [schemas.QuestionOut.model_validate(r) for r in rows]

# --- SUBMIT ROUTE (Có bảo mật) ---
@app.post(settings.API_PREFIX + "/submit")
async def submit_answers(
    payload: dict = Body(...), 
    db: AsyncSession = Depends(get_db),
    # Dòng này bắt buộc người dùng phải có Token mới được nộp bài
    current_user: models.User = Depends(auth.get_current_user) 
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