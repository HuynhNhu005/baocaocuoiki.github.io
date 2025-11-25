from sqlalchemy.orm import Session
import models, schemas

def create_question(db: Session, q: schemas.QuestionCreate):
    question = models.Question(**q.dict())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

def get_random_questions(db: Session, limit: int = 5):
    return db.query(models.Question).order_by(models.func.random()).limit(limit).all()
