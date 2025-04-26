import re
import urllib
import json

from fastapi import HTTPException
import httpx
from app.services.openrouter_service import query_openrouter

# Helper: Format AI Response for Readability
def format_response(response: str) -> str:
    formatted = re.sub(r"(?<!\n)(\d+\.\s)", r"\n\1", response)
    formatted = re.sub(r"(?<!\n)(- )", r"\n\1", formatted)
    return formatted.strip()

# Helper: Keyword Extraction for News Search
def extract_keywords(idea: str) -> str:
    stopwords = {"a", "that", "offers", "for", "and", "with", "the", "to", "on", "of", "in", "an", "is", "this"}
    idea = re.sub(r"[^\w\s]", "", idea.lower())
    words = [word for word in idea.split() if word not in stopwords]
    return " ".join(words[:5])

# Helper: Fetch News Articles (GNews API)
async def fetch_news(idea: str):
    keywords = extract_keywords(idea)
    url = f"https://gnews.io/api/v4/search?q={urllib.parse.quote(keywords)}&token=44a083eec3cdc004d89717781075c250&lang=en&max=3"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        data = response.json()

    articles = data.get("articles", [])
    headlines = [article["title"] for article in articles if "title" in article]
    return headlines

# 1. Idea Validation Logic  
async def validate_idea_logic(idea: str):
    news = await fetch_news(idea)
    news_text = "\n".join([f"- {article}" for article in news])

    prompt = f"""
You're a startup mentor. Evaluate the following startup idea:
"{idea}"

Recent news related to the idea:
{news_text}

1. Is the idea practical and in real-world demand?
2. Does it solve a real problem?
3. Are there already similar existing solutions or companies?
4. If yes, what should the founder do to stand out or improve upon it?
5. Would you recommend continuing with this idea? Why or why not?

Give a clear, helpful response.
"""
    result = await query_openrouter(prompt)
    return {"result": format_response(result)}

# 2. MVP Planner Logic
async def mvp_planner_logic(idea_text: str):
    prompt = f"Create an MVP plan for this startup idea:\n{idea_text}"
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 3. Go-To-Market Strategy Logic
async def go_to_market_logic(idea_text: str):
    news = await fetch_news(idea_text)
    news_text = "\n".join([f"- {article}" for article in news])

    prompt = f"""
Suggest a go-to-market strategy for this product:
{idea_text}

Here is some real-time news and updates about this industry:
{news_text}

Give a detailed but clear strategy that aligns with the current landscape.
"""
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. Pitch Deck Generator Logic
async def pitch_deck_logic(idea_text: str):
    base_prompt = f"""Generate a pitch deck structure for this idea:
{idea_text}

Return the result in JSON format with this structure:

[
    {{
        "title": "Section Title",
        "content": "Pitch content here...",
        "visual_suggestion": "💡 Visual suggestion clearly labeled and helpful for the pitch slide."
    }},
    ...
]

Structure:
1. Title 
2. Problem 
3. Solution
4. Market Size
5. Product
6. Business Model
7. Traction
8. Team
9. Competition
10. Financials
"""
    try:
        response = await query_openrouter(base_prompt)
        if isinstance(response, str):
            try:
                structured = json.loads(response)
                return {"sections": structured}
            except json.JSONDecodeError:
                return {"raw_result": format_response(response)}
        return {"sections": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 5. Business Model Logic
async def business_model_logic(idea_text: str):
    prompt = f"""
Suggest a scalable business model for this startup idea:
{idea_text}

Explain clearly:
1. 💰 How will the product generate revenue?
2. 🙋 Who pays and why?
3. 🧮 What is the pricing strategy?
4. 📊 What is the cost structure?

Format the answer using numbered points and line breaks so it’s easy to read.
"""
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. Financial Forecast Logic
async def financial_forecast_logic(idea_text: str):
    prompt = f"Provide a simple financial forecast for the following startup:\n{idea_text}\nInclude revenue streams, projected costs, and estimated profits over 3 years."
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 7. Competitive Analysis Logic
async def competitive_analysis_logic(idea_text: str):
    news = await fetch_news(idea_text)
    news_text = "\n".join([f"- {article}" for article in news])
    prompt = f"""
Do a competitive analysis for this startup idea:
{idea_text}

Recent news and updates about this market:
{news_text}

Mention key competitors, their strengths/weaknesses, and how to differentiate.
"""
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 8. Investor Email Logic
async def investor_email_logic(idea_text: str):
    prompt = f"""Write a compelling cold email to pitch this startup idea to an investor.

Startup Idea:
{idea_text}

Include:
- A catchy subject line
- A brief intro of the founder
- What problem the startup solves
- Why now is the right time
- A closing CTA (like setting up a call)

Make the tone professional and persuasive."""
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 9. Tagline and Name Generator Logic
async def tagline_name_generator_logic(idea_text: str):
    prompt = f"""Generate a unique and catchy startup name and a tagline based on the following idea:

{idea_text}

Return:
1. A brandable startup name
2. A short, punchy tagline (max 12 words)
3. Optional: Explain why you chose that name

Format your response clearly."""
    try:
        response = await query_openrouter(prompt)
        return {"result": format_response(response)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
