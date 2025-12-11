from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

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
