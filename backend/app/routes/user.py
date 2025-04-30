import os
import shutil
from bson import ObjectId
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile,  Request
from fastapi.security import OAuth2PasswordBearer
from openai import models
from pydantic import BaseModel, EmailStr
from app.models import user_model
from app.db.database import user_collection
from sqlalchemy.orm import Session

from fastapi.responses import JSONResponse
from requests import Session

from ..utils.hash import hash_password
from ..utils.jwt import get_current_user, verify_password_reset_token
from ..models.user_model import UserOut, UserUpdate
from ..db.database import db
from ..utils.jwt import create_password_reset_token
from ..utils.mailer import send_reset_password_email

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.get("/me", response_model=UserOut)
async def get_profile(user: dict = Depends(get_current_user)):
    # Ensure the profile_image URL is constructed correctly
    profile_image = user.get("profile_image")
    profile_image_url = (
        f"http://localhost:8000/static/{profile_image}"
        if user.get('profile_image') and not user['profile_image'].startswith("http")
        else user.get('profile_image')  # Use as-is if already a full URL
    )

    response_data = {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "profile_image": profile_image_url,
    }

    return JSONResponse(content=response_data, headers={"Cache-Control": "no-store"})


@router.patch("/update")
async def update_user(
    name: str = Form(None),
    email: str = Form(None),
    password: str = Form(None),
    profileImage: UploadFile = File(None),
    current_user: dict = Depends(get_current_user),
):
    user_id = current_user["_id"]  # Ensure this is the ObjectId
    update_data = {}

    # Update name, email, and password if provided
    if name:
        update_data["full_name"] = name
    if email:
        update_data["email"] = email
    if password:
        update_data["password"] = hash_password(password)  # Hash the password

    # Handle profile image upload
    if profileImage:
        # Ensure the folder exists
        image_folder = "static/profile/"
        os.makedirs(image_folder, exist_ok=True)

        # Save the image with a unique name (e.g., user_id.png)
        image_path = os.path.join(image_folder, f"{user_id}.png")
        with open(image_path, "wb") as f:
            f.write(await profileImage.read())

        # Save the relative path in the database
        update_data["profile_image"] = f"profile/{user_id}.png"

    # Update the user in the database
    result = await user_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch the updated user data
    updated_user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Construct the profile image URL
    profile_image_url = (
        f"http://localhost:8000/static/{updated_user['profile_image']}"
        if updated_user.get('profile_image') and not updated_user['profile_image'].startswith("http")
        else updated_user.get('profile_image')
    )

    # Return the updated user data
    return JSONResponse(content={
        "message": "User updated successfully",
        "user": {
            "id": str(updated_user["_id"]),
            "email": updated_user["email"],
            "full_name": updated_user["full_name"],
            "profile_image": profile_image_url,
        }
    })

class PasswordResetRequest(BaseModel):
    email: EmailStr


@router.post("/request-password-reset")
async def request_password_reset(request: Request, data: PasswordResetRequest):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_password_reset_token({"sub": data.email})
    reset_link = f"{request.base_url}user/reset-password?token={token}"

    await send_reset_password_email(data.email, reset_link)

    return {"msg": "Reset link sent to your email"}

class ResetPassword(BaseModel):
    token: str
    new_password: str

@router.get("/reset-password")
async def reset_password(data: ResetPassword):
    email = verify_password_reset_token(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed_pw = hash_password(data.new_password)

    await db.users.update_one({"email": email}, {"$set": {"password": hashed_pw}})
    return {"msg": "Password reset successful"} 

# ✅ Logout Route
@router.post("/logout")
async def logout():
    """
    Logout the user by invalidating the token on the client side.
    This route simply informs the client to clear the token.
    """
    return JSONResponse(
        content={"msg": "Logout successful"},
        headers={
            "Cache-Control": "no-store",  # Prevent caching of the response
            "Pragma": "no-cache"          # Ensure no caching
        }
    )