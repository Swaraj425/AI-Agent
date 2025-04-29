# app/database.py

import motor.motor_asyncio
import os
from dotenv import load_dotenv
from app.config.config import settings

# Load env variables
load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("⚠️ MONGODB_URL not found in environment variables!")

# Connect to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client[settings.DATABASE_NAME]  # Make sure the DB name matches the one in your connection string
# print("MONGODB_URL:", MONGODB_URL)

# ✅ Collections
user_collection = db["users"]              # already used for registration/login
chat_collection = db["chats"]              # NEW: for saving chats