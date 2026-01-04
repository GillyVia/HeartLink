# backend/crud.py
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, Riwayat
import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# =========================
# USER
# =========================
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    if not isinstance(user.password, str) or not user.password.strip():
        raise ValueError("Password tidak valid")

    raw_password = user.password[:72]  # bcrypt limit
    hashed_password = pwd_context.hash(raw_password)

    db_user = User(
        email=user.email,
        first_name=user.first_name or "",
        last_name=user.last_name or "",
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not pwd_context.verify(password[:72], user.password):
        return None
    return user


# =========================
# RIWAYAT (locked by current_user)
# =========================
def create_riwayat(db: Session, user_id: int, data: schemas.RiwayatCreate):
    riwayat = Riwayat(
        user_id=user_id,
        risk=data.risk,
        probability=data.probability,
        answers=data.answers
    )
    db.add(riwayat)
    db.commit()
    db.refresh(riwayat)
    return riwayat

def get_riwayat_by_user(db: Session, user_id: int):
    return (
        db.query(Riwayat)
        .filter(Riwayat.user_id == user_id)
        .order_by(Riwayat.date.desc())
        .all()
    )
