from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas
import random

# =======================================================
# CÁC HÀM CƠ BẢN (CHO SINH VIÊN & HỆ THỐNG)
# =======================================================

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
    
    res = await db.execute(stmt)
    rows = res.scalars().all()
    if not rows:
        return []
    sampled = random.sample(rows, min(limit, len(rows)))
    return sampled

# =======================================================
# CÁC HÀM ADMIN (QUẢN LÝ DỮ LIỆU)
# =======================================================

# 1. Lấy tất cả câu hỏi (Mới nhất lên đầu)
async def get_all_questions(db: AsyncSession):
    result = await db.execute(select(models.Question).order_by(models.Question.id.desc()))
    return result.scalars().all()

# 2. Xóa câu hỏi
async def delete_question(db: AsyncSession, qid: int):
    q = await get_question_by_id(db, qid)
    if q:
        await db.delete(q)
        await db.commit()
        return True
    return False

# 3. Cập nhật câu hỏi
async def update_question(db: AsyncSession, qid: int, q_data: schemas.QuestionCreate):
    q = await get_question_by_id(db, qid)
    if q:
        q.title = q_data.title
        q.category = q_data.category
        q.difficulty = q_data.difficulty
        q.choices = q_data.choices
        q.answer = q_data.answer
        q.explanation = q_data.explanation
        await db.commit()
        await db.refresh(q)
        return q
    return None

# 4. Lấy tất cả Users
async def get_all_users(db: AsyncSession):
    result = await db.execute(select(models.User).order_by(models.User.id))
    return result.scalars().all()

# 5. Lấy lịch sử thi của User cụ thể
async def get_user_history(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.ExamResult).where(models.ExamResult.user_id == user_id).order_by(models.ExamResult.created_at.desc()))
    return result.scalars().all()

# 6. Thống kê Dashboard
async def get_stats(db: AsyncSession):
    total_users = (await db.execute(select(func.count()).select_from(models.User))).scalar()
    total_questions = (await db.execute(select(func.count()).select_from(models.Question))).scalar()
    total_exams = (await db.execute(select(func.count()).select_from(models.ExamResult))).scalar()
    return {"users": total_users, "questions": total_questions, "exams": total_exams}


async def delete_user(db: AsyncSession, user_id: int):
    # Cần đảm bảo không xóa tài khoản Admin cuối cùng!
    user = await db.get(models.User, user_id)
    if user:
        await db.delete(user)
        await db.commit()
        return True
    return False

async def update_user_role(db: AsyncSession, user_id: int, new_role: str, new_fullname: str):
    user = await db.get(models.User, user_id)
    if user:
        user.role = new_role
        user.full_name = new_fullname
        await db.commit()
        await db.refresh(user)
        return user
    return None