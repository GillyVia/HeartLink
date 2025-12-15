from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))

    nik = Column(String(50), default="")
    ttl = Column(String(100), default="")
    jenis_kelamin = Column(String(20), default="")
    alamat = Column(String(255), default="")
    kewarganegaraan = Column(String(100), default="")
    no_hp = Column(String(20), default="")
    foto = Column(String(255), default="")
    
    riwayat = relationship("Riwayat", back_populates="user", cascade="all, delete")
    
    # === MODEL RIWAYAT SKRINNING ===
class Riwayat(Base):
    __tablename__ = "riwayat"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    risk = Column(String(50))
    probability = Column(Float)
    answers = Column(JSON)
    date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="riwayat")
