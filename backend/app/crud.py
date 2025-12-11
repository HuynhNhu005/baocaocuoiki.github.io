from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas
import random
from typing import List

async def create_question(db: AsyncSession, q: schemas.QuestionCreate):
    obj = models.Question(
        category=q.category,
        difficulty=q.difficulty,
        title=q.title,
        choices=q.choices,
        answer=q.answer,
        explanation=q.explanation
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

async def get_question_by_id(db: AsyncSession, qid: int):
    result = await db.get(models.Question, qid)
    return result

async def get_random_questions(db: AsyncSession, limit: int = 10, category: str = None, difficulty: str = None):
    stmt = select(models.Question).where(models.Question.active == True)
    if category:
        stmt = stmt.where(models.Question.category == category)
    if difficulty:
        stmt = stmt.where(models.Question.difficulty == difficulty)
    # fetch all candidate ids then choose random (simple)
    res = await db.execute(stmt)
    rows = res.scalars().all()
    if not rows:
        return []
    sampled = random.sample(rows, min(limit, len(rows)))
    return sampled
