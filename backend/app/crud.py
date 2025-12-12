from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas
import random
from sqlalchemy.orm import selectinload
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
# 7. Lấy bảng xếp hạng (Top 10 điểm cao nhất)
async def get_leaderboard(db: AsyncSession, limit: int = 10):
    
    # BƯỚC 1: Tìm điểm cao nhất (max_score) cho mỗi user
    max_scores_subquery = select(
        models.ExamResult.user_id,
        func.max(models.ExamResult.score).label("max_score")
    ).group_by(models.ExamResult.user_id).subquery()
    
    # BƯỚC 2: Join với bảng User để lấy tên và sắp xếp
    stmt = select(
        models.User.username,
        models.User.full_name,
        max_scores_subquery.c.max_score
    ).join(max_scores_subquery, models.User.id == max_scores_subquery.c.user_id).order_by(max_scores_subquery.c.max_score.desc()).limit(limit)

    result = await db.execute(stmt)
    
    # BƯỚC 3: Xử lý kết quả trả về dưới dạng list of dicts (dict là tốt nhất cho Frontend)
    leaderboard_data = []
    for username, full_name, max_score in result.all():
        leaderboard_data.append({
            "username": username,
            "full_name": full_name,
            "max_score": max_score
        })
        
    return leaderboard_data

# =======================================================
# QUẢN LÝ LỚP HỌC (CLASS MANAGEMENT)
# =======================================================

# 1. Tạo lớp học mới
async def create_class(db: AsyncSession, c: schemas.ClassCreate):
    # Kiểm tra mã lớp trùng
    res = await db.execute(select(models.Class).where(models.Class.code == c.code))
    if res.scalars().first():
        return None  # Mã lớp đã tồn tại
        
    new_class = models.Class(
        name=c.name,
        code=c.code,
        description=c.description
    )
    db.add(new_class)
    await db.commit()
    await db.refresh(new_class)
    return new_class

# 2. Lấy danh sách tất cả lớp học (Kèm đếm số học sinh)
async def get_all_classes(db: AsyncSession):
    # Dùng selectinload để lấy luôn danh sách students kèm theo
    stmt = select(models.Class).options(selectinload(models.Class.students)).order_by(models.Class.id.desc())
    result = await db.execute(stmt)
    classes = result.scalars().all()
    # Cập nhật số lượng thủ công cho schema
    for c in classes:
        c.student_count = len(c.students)
    return classes

# 3. Thêm học sinh vào lớp
async def add_student_to_class(db: AsyncSession, class_id: int, student_username: str):
    # Tìm lớp
    cls = await db.get(models.Class, class_id)
    if not cls: return "class_not_found"
    
    # Tìm học sinh
    res = await db.execute(select(models.User).where(models.User.username == student_username))
    student = res.scalars().first()
    if not student: return "student_not_found"
    
    # Thêm vào (SQLAlchemy sẽ tự xử lý bảng phụ)
    # Lưu ý: Cần load relationship trước nếu chưa load (nhưng với async sinh ra lỗi lazy load)
    # Cách an toàn nhất với Async là insert trực tiếp vào bảng phụ, nhưng ta dùng cách append object
    # Để đơn giản, ta cần eager load 'students' hoặc dùng lệnh insert.
    
    # Cách đơn giản: Kiểm tra xem đã có chưa
    stmt = select(models.class_student_association).where(
        models.class_student_association.c.class_id == class_id,
        models.class_student_association.c.user_id == student.id
    )
    exists = (await db.execute(stmt)).first()
    if exists: return "already_in_class"

    # Insert thủ công vào bảng phụ
    stmt = models.class_student_association.insert().values(class_id=class_id, user_id=student.id)
    await db.execute(stmt)
    await db.commit()
    return "success"

# 4. Gán giáo viên cho lớp
async def assign_teacher_to_class(db: AsyncSession, class_id: int, teacher_id: int):
    cls = await db.get(models.Class, class_id)
    if cls:
        cls.teacher_id = teacher_id
        await db.commit()
        return True
    return False
# THÊM HÀM NÀY (Để bỏ chọn sinh viên)
async def remove_student_from_class(db: AsyncSession, class_id: int, student_id: int):
    # Xóa khỏi bảng phụ
    stmt = models.class_student_association.delete().where(
        models.class_student_association.c.class_id == class_id,
        models.class_student_association.c.user_id == student_id
    )
    await db.execute(stmt)
    await db.commit()
    return True

# Lấy danh sách lớp mà User này làm Giáo viên chủ nhiệm
async def get_teacher_classes(db: AsyncSession, teacher_id: int):
    # Load kèm danh sách học sinh để hiển thị
    stmt = select(models.Class).options(selectinload(models.Class.students)).where(models.Class.teacher_id == teacher_id)
    result = await db.execute(stmt)
    classes = result.scalars().all()
    
    # Tính toán sĩ số
    for c in classes:
        c.student_count = len(c.students)
    return classes