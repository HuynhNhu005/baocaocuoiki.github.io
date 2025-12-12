# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Lấy URL từ biến môi trường hoặc dùng mặc định
# Lưu ý: Nếu chạy bằng Docker Compose, host thường là tên service db (vd: "db")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/dbname")

engine = create_async_engine(DATABASE_URL, echo=True)

SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

Base = declarative_base()

# Dependency để lấy DB session
async def get_db():
    async with SessionLocal() as session:
        yield session
