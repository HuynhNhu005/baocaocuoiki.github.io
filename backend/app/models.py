from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON, Float, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
from sqlalchemy.dialects.postgresql import ARRAY
# Bảng phụ để liên kết Sinh viên - Lớp học (Quan hệ nhiều-nhiều)
class_student_association = Table(
    'class_students', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('class_id', Integer, ForeignKey('classes.id'))
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String(200), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="student") # student / teacher / admin

    # Quan hệ ngược:
    # 1. Các lớp mà user này làm Giáo viên chủ nhiệm
    teaching_classes = relationship("Class", back_populates="teacher")
    
    # 2. Các lớp mà user này là Học sinh (thông qua bảng phụ)
    enrolled_classes = relationship("Class", secondary=class_student_association, back_populates="students")

class Class(Base):
    __tablename__ = "classes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # Tên lớp (VD: CNTT_K15)
    code = Column(String(20), unique=True, index=True) # Mã lớp (VD: IT001) - Dùng để tìm kiếm
    description = Column(Text, nullable=True)
    
    # Giáo viên chủ nhiệm (1 Lớp có 1 GV)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    teacher = relationship("User", back_populates="teaching_classes")
    exams = relationship("Exam", back_populates="target_class")

    # Danh sách học sinh trong lớp
    students = relationship("User", secondary=class_student_association, back_populates="enrolled_classes")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), index=True)
    difficulty = Column(String(20), default="medium")  # easy, medium, hard
    title = Column(Text, nullable=False)
    choices = Column(JSON, nullable=False)  # list of choices
    answer = Column(Integer, nullable=False)  # index of correct choice
    explanation = Column(Text, nullable=True)
    active = Column(Boolean, default=True)
    
    # (Nâng cao sau này: Question có thể thuộc về 1 Giáo viên cụ thể để không bị lộ đề)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)

class ExamResult(Base):
    __tablename__ = "exam_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    detail_history = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Quan hệ
    user = relationship("User", backref="exam_results")
    
class Exam(Base):
    __tablename__ = "exams"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"))
    duration = Column(Integer, default=45) # Thời gian làm bài (phút)
    question_ids = Column(ARRAY(Integer))  # Lưu danh sách ID câu hỏi: [1, 5, 10]
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    max_attempts = Column(Integer, default=1)

    # Relationship
    target_class = relationship("Class", back_populates="exams")

# Cập nhật ngược lại vào class Class (để link 2 bảng)
# Tìm class Class cũ và thêm dòng này vào bên trong:
# exams = relationship("Exam", back_populates="target_class")