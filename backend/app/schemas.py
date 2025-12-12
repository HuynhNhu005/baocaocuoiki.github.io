from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- QUESTION SCHEMAS ---
class QuestionCreate(BaseModel):
    category: str
    difficulty: str
    title: str
    choices: List[str]
    answer: int
    explanation: Optional[str] = None

class QuestionOut(BaseModel):
    id: int
    category: str
    difficulty: str
    title: str
    choices: List[str]
    class Config:
        from_attributes = True

class QuestionWithAnswer(QuestionOut):
    answer: int
    explanation: Optional[str]

# --- USER & AUTH SCHEMAS (MỚI) ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    full_name: Optional[str] = None
    email: str          # <--- Mới: Bắt buộc nhập email
    phone_number: str   # <--- Mới: Bắt buộc nhập sđt

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str      # <--- Thêm dòng này
    username: str  # <--- Thêm dòng này để tiện hiển thị
    email: Optional[str] = None        # <--- Mới: Trả về email khi login
    phone_number: Optional[str] = None # <--- Mới: Trả về sđt khi login

class UserOut(UserBase):
    id: int
    full_name: Optional[str] = None
    role: str
    email: Optional[str] = None        # <--- Mới: Hiển thị email
    phone_number: Optional[str] = None # <--- Mới: Hiển thị sđt
    class Config:
        from_attributes = True

# --- EXAM RESULT SCHEMAS (MỚI) ---
class ExamResultOut(BaseModel):
    id: int
    score: float
    total_questions: int
    correct_answers: int
    created_at: datetime
    class Config:
        from_attributes = True