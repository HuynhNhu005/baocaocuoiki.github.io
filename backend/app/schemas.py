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

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(UserBase):
    id: int
    full_name: Optional[str] = None
    role: str
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