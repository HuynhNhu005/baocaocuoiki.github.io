from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from .database import engine, Base, get_db
from . import crud, schemas, models, utils
from .config import settings
import asyncio

app = FastAPI(title="Online Quiz API")

# Allow CORS from frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # create tables if not exist (simple approach)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get(settings.API_PREFIX + "/health")
async def health():
    return {"status": "ok"}

@app.post(settings.API_PREFIX + "/questions", response_model=schemas.QuestionWithAnswer)
async def create_question(q: schemas.QuestionCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_question(db, q)

@app.get(settings.API_PREFIX + "/questions/random", response_model=list[schemas.QuestionOut])
async def get_random(limit: int = 10, category: str = None, difficulty: str = None, db: AsyncSession = Depends(get_db)):
    rows = await crud.get_random_questions(db, limit=limit, category=category, difficulty=difficulty)
    # we must not expose answer in exam mode
    # SỬA DÒNG NÀY: Dùng model_validate thay vì from_orm
    return [schemas.QuestionOut.model_validate(r) for r in rows]

@app.post(settings.API_PREFIX + "/submit")
async def submit_answers(payload: dict = Body(...), db: AsyncSession = Depends(get_db)):
    # payload: { "answers": { "<qid>": <selected_index>, ... } }
    answers = payload.get("answers", {})
    
    # Chuyển keys sang int
    try:
        qids = list(map(int, answers.keys()))
    except ValueError:
        return {"total": 0, "correct": 0, "score": 0, "details": []}
        
    questions = []
    for qid in qids:
        q = await crud.get_question_by_id(db, qid)
        if q:
            questions.append(q)
            
    result = utils.grade(questions, answers)
    return result