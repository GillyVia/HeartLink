from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def verify_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if user and user.password == password:  # nanti bisa diganti hash
        return user
    return None

def create_user(db: Session, user: UserCreate):
    db_user = User(email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
