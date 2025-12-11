from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:nghia301223@localhost:5432/quizdb"
    API_PREFIX: str = "/api"

settings = Settings()
