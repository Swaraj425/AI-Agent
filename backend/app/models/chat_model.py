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
    def validate(cls, v, field=None):  # Add `field` parameter for compatibility
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return str(v)

class Message(BaseModel):
    sender: str  # 'user' or 'ai'
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
class ChatAgentRequest(BaseModel):
    message: str
    current_step: Optional[str] = "introduction"
    idea_context: Optional[str] = None
    chat_id: Optional[str] = None  # Add this field

class NewChatRequest(BaseModel):
    title: str
    initial_message: Optional[str] = None

class ChatSession(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    title: str
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_initialized: bool = Field(default=False)

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }