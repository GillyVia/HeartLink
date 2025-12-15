from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

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
        orm_mode = True
        
        # === RIWAYAT SKRINNING ===
class RiwayatCreate(BaseModel):
    user_id: int
    risk: str
    probability: float
    answers: List[int]

class RiwayatResponse(BaseModel):
    id: int
    user_id: int
    risk: str
    probability: float
    answers: List[int]
    date: datetime

    class Config:
        from_attributes = True
