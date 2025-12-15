from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, Riwayat
import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    # ✅ Validasi password
    if not isinstance(user.password, str) or not user.password.strip():
        raise ValueError("Password tidak valid")

    # ✅ Batasi panjang password (bcrypt limit 72 bytes)
    raw_password = user.password[:72]
    hashed_password = pwd_context.hash(raw_password)

    # ✅ Buat user baru
    db_user = User(
        email=user.email,
        first_name=user.first_name or "",
        last_name=user.last_name or "",
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return schemas.UserResponse(
        id=db_user.id,
        email=db_user.email,
        first_name=db_user.first_name,
        last_name=db_user.last_name
    )

# =========================================
#  LOGIN USER
# =========================================
def verify_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    # ✅ Verifikasi password
    if not pwd_context.verify(password[:72], user.password):
        return None

    return user

# === CRUD RIWAYAT SKRINNING ===
def create_riwayat(db: Session, data: schemas.RiwayatCreate):
    riwayat = Riwayat(
        user_id=data.user_id,
        risk=data.risk,
        probability=data.probability,
        answers=data.answers
    )
    db.add(riwayat)
    db.commit()
    db.refresh(riwayat)
    return riwayat

def get_riwayat_by_user(db: Session, user_id: int):
    return db.query(Riwayat).filter(Riwayat.user_id == user_id).order_by(Riwayat.date.desc()).all()