from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Request
from  app.db.database import chat_collection
from pydantic import BaseModel
from typing import Optional
import re
from app.services.ai_agent_serives import (
    validate_idea_logic,
    mvp_planner_logic,
    go_to_market_logic,
    pitch_deck_logic,
    business_model_logic,
    financial_forecast_logic,   
    competitive_analysis_logic,
    investor_email_logic,
    tagline_name_generator_logic,
)
from app.models.chat_model import ChatAgentRequest, Message
from app.utils.jwt import get_current_user  # Import the dependency to fetch the current user

router = APIRouter()

# Mapping steps to prompts or functions
STEP_FLOW = [
    "introduction",
    "idea-validate",
    "mvp-planning",
    "go-to-market",
    "pitch-deck",
    "business-model",
    "financial-forecast",
    "competitive-analysis",
    "investor-email",
    "tagline-name",
    "completed"
]   

@router.post("/chat-agent")
async def chat_agent_handler(
    request: Request,
    data: ChatAgentRequest,
    current_user: dict = Depends(get_current_user)  # Fetch the current user    
):
    try: 
        user_id = current_user["_id"]  # Extract the user ID from the authenticated user
        message = data.message
        step = data.current_step
        chat_id = data.chat_id 

        # Fetch the chat object from the database
        chat = await chat_collection.find_one({"_id": ObjectId(chat_id)})
        if not chat:
            raise HTTPException(status_code=404, detail="Chat session not found.")

        # Use the saved idea_context if available, otherwise fallback to the message
        idea = chat.get("idea_context", message)

        # If idea_context is not already saved, update the database
        if not chat.get("idea_context"):
            await chat_collection.update_one(
                {"_id": ObjectId(chat_id)},
                {"$set": {"idea_context": idea}}
            )

        # Determine the current step from the database if not provided
        step = chat.get("next_step", step)

        # Step: AI logic based on the current step
        ai_response = ""
        next_step = ""

        print(f"Current step: {step}, Next step: {next_step}")

        if step == "idea-validate":
            ai_response = await validate_idea_logic(idea)
            next_step = "mvp-planning"

        elif step == "mvp-planning":
            ai_response = await mvp_planner_logic(idea)
            next_step = "go-to-market"

        elif step == "go-to-market":
            ai_response = await go_to_market_logic(idea)
            next_step = "pitch-deck"

        elif step == "pitch-deck":
            ai_response = await pitch_deck_logic(idea)
            next_step = "business-model"

        elif step == "business-model":
            ai_response = await business_model_logic(idea)
            next_step = "financial-forecast"

        elif step == "financial-forecast":
            ai_response = await financial_forecast_logic(idea)
            next_step = "competitive-analysis"

        elif step == "competitive-analysis":
            ai_response = await competitive_analysis_logic(idea)
            next_step = "investor-email"

        elif step == "investor-email":
            ai_response = await investor_email_logic(idea)
            next_step = "tagline-name"

        elif step == "tagline-name":
            ai_response = await tagline_name_generator_logic(idea)
            next_step = "completed"

        elif step == "completed":
            ai_response = "🎉 Congratulations! You have successfully completed all the steps. If you have a new idea, click on 'New Chat' to start again."
            next_step = ""

        else:
            ai_response = ""
            next_step = ""

        def format_response_text(text):
            # Remove repeated numbers like "1.1", "2.2", etc.
            formatted = re.sub(r"(\d+)\.\d+(\s+)", r"\1\2", text)  # Keep the number and space, remove the second number
            return formatted.strip()

        if isinstance(ai_response, dict) and "result" in ai_response:
            final_response = format_response_text(ai_response["result"])

        elif isinstance(ai_response, dict) and "sections" in ai_response:
            import json
            final_response = json.dumps(ai_response["sections"], indent=2)

        else:
            final_response = format_response_text(str(ai_response))

        # Save both user message and AI response to chat
        if chat_id:
            # Check if this is a new chat (first message)
            is_new_chat = not chat.get("is_initialized", False)

            if is_new_chat:
                # For new chat, add both messages and mark as initialized
                new_messages = [
                    Message(sender="user", text=message, timestamp=datetime.utcnow()),
                    Message(sender="ai", text=final_response, timestamp=datetime.utcnow())
                ]
                await chat_collection.update_one(
                    {"_id": ObjectId(chat_id)},
                    {
                        "$push": {"messages": {"$each": [msg.dict() for msg in new_messages]}},
                        "$set": {
                            "is_initialized": True,
                            "title": message[:30] + "...",  # Update title with first message
                            "next_step": next_step  # Save the next step
                        }
                    }
                )
            else:
                # For existing chat, add both messages
                new_messages = [
                    Message(sender="user", text=message, timestamp=datetime.utcnow()),
                    Message(sender="ai", text=final_response, timestamp=datetime.utcnow())
                ]
                await chat_collection.update_one(
                    {"_id": ObjectId(chat_id)},
                    {
                        "$push": {"messages": {"$each": [msg.dict() for msg in new_messages]}},
                        "$set": {"next_step": next_step}  # Save the next step
                    }
                )
                print(f"Current step: {step}, Next step: {next_step}")
        return {
            "response": final_response,
            "next_step": next_step
        }
    except Exception as e:
        print(f"Error in chat_agent_handler: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )