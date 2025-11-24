from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User
import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
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
#  FUNGSI LOGIN 
# =========================================
def verify_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    
    # Cek apakah password benar
    if not pwd_context.verify(password, user.password):
        return None

    return user

