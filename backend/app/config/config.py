# filepath: f:\Swaraj\Projects\Hackathon Projects\Microsoft Hackathon AI Agent\Startup Copilot\backend\app\config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# Explicitly specify the path to the .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))

class Settings(BaseSettings):
    MONGODB_URL: str
    SECRET_KEY: str
    DATABASE_NAME: str
    OPENROUTER_API_KEY: str
    OPENROUTER_API_URL: str
    GNEWS_API_KEY: str
    CORS_ORIGINS: str
    SECRET_KEY: str
    ALGORITHM: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()