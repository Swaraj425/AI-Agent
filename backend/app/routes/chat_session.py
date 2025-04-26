from fastapi import APIRouter, Depends, HTTPException
from app.models.chat_model import ChatSession, Message, NewChatRequest
from app.db.database import chat_collection  # assume defined
from bson import ObjectId
from typing import List
from datetime import datetime
from app.utils.jwt import get_current_user  # Import to fetch the current user
from app.db.database import db

router = APIRouter()

# Create a new chat session

@router.post("/new")
async def create_chat(
    data: NewChatRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = str(current_user["_id"])
    
    # Only create chat if there's an initial message
    if not data.initial_message:
        raise HTTPException(
            status_code=400,
            detail="Initial message is required to create a chat"
        )
    
    # Create new chat session without messages
    new_chat = ChatSession(
        user_id=user_id,
        title=data.title,
        messages=[],  # Start with empty messages array
        is_initialized=False  # Set to False initially
    )

    result = await chat_collection.insert_one(new_chat.dict(by_alias=True))
    
    # Update user's chats array
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"chats": str(result.inserted_id)}}
    )

    return {"chat_id": str(result.inserted_id)}


# Add message to a chat session
@router.post("/{chat_id}/add")
async def add_message(
    chat_id: str,
    data: dict,  # Accept a dict instead of individual parameters
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = str(current_user["_id"])
        chat = await chat_collection.find_one({"_id": ObjectId(chat_id), "user_id": user_id})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found or unauthorized")
        
        # Validate required fields
        if not data.get("sender") or not data.get("text"):
            raise HTTPException(
                status_code=422,
                detail="Missing required fields: sender and text are required"
            )
        
        message = Message(
            sender=data.get("sender"),
            text=data.get("text"),
            timestamp=datetime.utcnow()
        )
        
        await chat_collection.update_one(
            {"_id": ObjectId(chat_id)},
            {"$push": {"messages": message.dict()}}
        )
        return {"status": "message added"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error adding message: {str(e)}"
        )
    

@router.get("/user", response_model=List[ChatSession])
async def get_user_chats(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    # Only fetch initialized chats
    chats = await chat_collection.find(
        {
            "user_id": user_id,
            "is_initialized": True
        }
    ).sort("created_at", -1).to_list(100)
    return chats

# Get one chat's messages
@router.get("/{chat_id}", response_model=ChatSession)
async def get_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        
        # Validate chat_id format
        if not ObjectId.is_valid(chat_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid chat ID format"
            )
            
        chat = await chat_collection.find_one(
            {
                "_id": ObjectId(chat_id),
                "user_id": user_id
            }
        )
        
        if not chat:
            raise HTTPException(
                status_code=404,
                detail="Chat not found or unauthorized"
            )
            
        return chat
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving chat: {str(e)}"
        )
    try:
        user_id = str(current_user["_id"])
        
        # Validate chat_id format
        if not ObjectId.is_valid(chat_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid chat ID format"
            )
            
        chat = await chat_collection.find_one(
            {
                "_id": ObjectId(chat_id),
                "user_id": user_id
            }
        )
        
        if not chat:
            raise HTTPException(
                status_code=404,
                detail="Chat not found or unauthorized"
            )
            
        # Convert ObjectId to string
        chat["_id"] = str(chat["_id"])
        if "messages" in chat:
            for message in chat["messages"]:
                if "timestamp" in message:
                    message["timestamp"] = message["timestamp"].isoformat()
                    
        return chat
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving chat: {str(e)}"
        )