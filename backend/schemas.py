from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    first_name: str | None = None
    last_name: str | None = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        orm_mode = True
