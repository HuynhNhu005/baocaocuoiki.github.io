from pydantic import BaseModel
from typing import List, Optional

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
    # no answer here for outgoing question in exam mode
    class Config:
        from_attributes = True  # <-- Đã sửa dòng này (cũ là orm_mode = True)

class QuestionWithAnswer(QuestionOut):
    answer: int
    explanation: Optional[str]