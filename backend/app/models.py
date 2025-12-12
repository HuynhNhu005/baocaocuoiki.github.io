from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True)     # <--- THÊM MỚI
    phone_number = Column(String, nullable=True)        # <--- THÊM MỚI
    password_hash = Column(String(200), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), default="student") # student / admin

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

class ExamResult(Base):
    __tablename__ = "exam_results"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    detail_history = Column(JSON, nullable=True) # Lưu lại đáp án chi tiết
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Quan hệ để truy vấn ngược
    user = relationship("User", backref="exam_results")