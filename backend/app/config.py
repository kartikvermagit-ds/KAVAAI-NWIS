import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "KAVAAI-NWIS"
    PROJECT_TITLE: str = "Nearby Wells Intelligence System"
    PROBLEM_STATEMENT: str = "SIH26121"
    THEME: str = "Smart Automation"
    TEAM: str = "KAVAAI"
    DATASET_TYPE: str = "Synthetic Demonstration Dataset"
    
    API_PORT: int = int(os.getenv("PORT", "8000"))
    API_HOST: str = os.getenv("HOST", "0.0.0.0")
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "kavaai_nwis.db")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen2.5:latest")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

settings = Settings()
