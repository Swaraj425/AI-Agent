# app/models/chat_model.py
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

# Helper to handle ObjectId in FastAPI
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        return str(v)

class Message(BaseModel):
    sender: str  # 'user' or 'ai'
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
class ChatAgentRequest(BaseModel):
    message: str
    current_step: Optional[str] = "introduction"
    idea_context: Optional[str] = None  # 👈 This will store the original startup idea

class ChatSession(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    title: str
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
