from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Quiz API is running!"}

@app.post("/add-question/")
def add_question(q: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, q)

@app.get("/get-quiz/")
def get_quiz(db: Session = Depends(get_db)):
    return crud.get_random_questions(db, limit=5)
