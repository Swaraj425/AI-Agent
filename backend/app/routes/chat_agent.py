from fastapi import APIRouter, Depends, HTTPException
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
from app.models.chat_model import ChatAgentRequest
from app.utils.jwt import get_current_user  # Import the dependency to fetch the current user

router = APIRouter()

# Mapping steps to prompts or functions
STEP_FLOW = [
    "introduction",
    "idea-validate",
    "mvp-planning",
    "go-to-market",
    "pitch-deck",
    "financial-forecast",
    "competitive-analysis",
    "investor-email",
    "tagline-name"
]

@router.post("/chat-agent")
async def chat_agent_handler(
    data: ChatAgentRequest,
    current_user: dict = Depends(get_current_user)  # Fetch the current user
):
    user_id = current_user["id"]  # Extract the user ID from the authenticated user
    message = data.message
    step = data.current_step
    idea = data.idea_context or message  # Carry forward the original idea

    # Step: AI logic based on the current step
    ai_response = ""
    next_step = ""

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

    else:
        ai_response = "Step not found. Please restart."
        next_step = "introduction"

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
    return {
        "response": final_response,
        "next_step": next_step
    }