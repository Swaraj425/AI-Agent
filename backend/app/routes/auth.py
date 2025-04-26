from fastapi import APIRouter, HTTPException, status, Depends
from ..models.user_model import UserCreate, UserLogin
from ..utils import hash, jwt
from ..db.database import db
from fastapi.responses import JSONResponse

router = APIRouter()

@router.post("/register")
async def register(user: UserCreate): 
    print("➡️ Register endpoint hit")
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash.hash_password(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_pw
    result = await db.users.insert_one(user_dict)
    return {"id": str(result.inserted_id), "email": user.email}



@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not hash.verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = jwt.create_access_token(db_user)


    return {"access_token": token, "token_type": "bearer", "msg": "Login successful"}

