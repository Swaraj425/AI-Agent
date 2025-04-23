# app/routes/chat_session.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.chat_model import ChatSession, Message
from app.db.database import chat_collection  # assume defined
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter()

# Create a new chat session
@router.post("/chats/new")
async def create_chat(user_id: str, title: str = "New Chat"):
    new_chat = ChatSession(user_id=user_id, title=title)
    result = await chat_collection.insert_one(new_chat.dict(by_alias=True))
    return {"chat_id": str(result.inserted_id)}

# Add message to a chat session
@router.post("/chats/{chat_id}/add")
async def add_message(chat_id: str, sender: str, text: str):
    message = Message(sender=sender, text=text, timestamp=datetime.utcnow())
    await chat_collection.update_one(
        {"_id": ObjectId(chat_id)},
        {"$push": {"messages": message.dict()}}
    )
    return {"status": "message added"}

# Get all chat sessions for user (for sidebar)
@router.get("/chats/user/{user_id}", response_model=List[ChatSession])
async def get_user_chats(user_id: str):
    chats = await chat_collection.find({"user_id": user_id}).to_list(100)
    return chats

# Get one chat's messages
@router.get("/chats/{chat_id}", response_model=ChatSession)
async def get_chat(chat_id: str):
    chat = await chat_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    return chat
