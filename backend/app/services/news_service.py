# app/services/news_service.py

import httpx
from app.config.config import settings

async def fetch_news(query: str, max_results=3):
    params = {
        "q": query,
        "token": settings.GNEWS_API_KEY,
        "lang": "en",
        "max": max_results
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(settings.GNEWS_API_URL, params=params)
        response.raise_for_status()
        articles = response.json().get("articles", [])
        
        # Format news snippets
        news_summary = "\n".join([f"- {a['title']} ({a['source']['name']})" for a in articles])
        return news_summary if news_summary else "No recent news found."
