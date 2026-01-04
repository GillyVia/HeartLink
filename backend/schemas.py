# backend/schemas.py
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

# =========================
# USER
# =========================
class UserBase(BaseModel):
    email: str
    first_name: str = ""
    last_name: str = ""

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True


# =========================
# TOKEN
# =========================
class TokenUser(BaseModel):
    id: int
    email: str
    first_name: str = ""
    last_name: str = ""

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: TokenUser


# =========================
# PREDICT
# =========================
class PredictRequest(BaseModel):
    answers: List[int] = Field(..., min_length=25, max_length=25)

class PredictResponse(BaseModel):
    risk: str
    probability: float


# =========================
# RIWAYAT
# =========================
class RiwayatCreate(BaseModel):
    risk: str
    probability: float
    answers: List[int] = Field(..., min_length=25, max_length=25)

class RiwayatResponse(BaseModel):
    id: int
    user_id: int
    risk: str
    probability: float
    answers: List[int]
    date: datetime

    class Config:
        from_attributes = True
