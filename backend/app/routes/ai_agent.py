from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.openrouter_service import query_openrouter
from app.services.news_service import fetch_news 
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

router = APIRouter()

class IdeaValidateRequest(BaseModel):
    idea: str
    
@router.post("/idea-validate")
async def idea_validate(request: IdeaValidateRequest):
    idea = request.idea
    result = await validate_idea_logic(idea)
    return {"result": result}

# MVP Planner Route
@router.post("/mvp-planner")
async def mvp_planner(idea: dict):
    try:
        response = await mvp_planner_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Go To Market Strategy Route (uses gnews api for real time updates)
@router.post("/go-to-market") 
async def go_to_market(idea: dict):
    try:
        response = await go_to_market_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pitch Deck Route
@router.post("/pitch-deck")
async def pitch_deck(idea: dict):
    try:
        response = await pitch_deck_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Business Model Route
@router.post("/business-model")
async def business_model(idea: dict):
    try:
        response = await business_model_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Financial Forecast Route
@router.post("/financial-forecast")
async def financial_forecast(idea: dict):
    try:
        response = await financial_forecast_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Competitive Analysis Route (uses gnews api for real time updates)
@router.post("/competitive-analysis")
async def competitive_analysis(idea: dict):
    try:
        response = await competitive_analysis_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Investor Email Route
class InvestorEmailRequest(BaseModel):
    startup_name: str
    startup_description: str
    unique_value: str
    target_market: str
    traction: str = ""
    funding_goal: str = ""

@router.post("/investor-email")
async def investor_email(data: InvestorEmailRequest):
    try:
        response = await investor_email_logic(data)
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Tagline & Name Generator Route
@router.post("/tagline-name-generator")
async def tagline_name_generator(idea: dict):
    try:
        response = await tagline_name_generator_logic(idea['text'])
        return {"result": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
