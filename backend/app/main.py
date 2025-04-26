from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes import auth, user, ai_agent
from fastapi.middleware.cors import CORSMiddleware
from app.config.config import settings
from app.routes import chat_agent
from app.routes import chat_session

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [origin.strip().rstrip("/") for origin in settings.CORS_ORIGINS.split(",")]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(ai_agent.router, prefix="/ai", tags=["AI Agent"])
app.include_router(chat_agent.router, tags=["Chat Agent"])
app.include_router(chat_session.router, prefix="/chats", tags=["Chat Sessions"])


@app.get("/")
async def root():
    return {"message": "🚀 Startup Copilot backend is running!"}
