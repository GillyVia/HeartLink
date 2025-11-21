from pydantic import BaseModel

# Model dasar untuk user
class UserBase(BaseModel):
    email: str
    first_name: str | None = None
    last_name: str | None = None

# Model untuk pendaftaran user baru
class UserCreate(UserBase):
    password: str

# Model untuk login
class UserLogin(BaseModel):
    email: str
    password: str

# Model untuk response user (yang dikembalikan API)
class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True
