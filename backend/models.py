from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

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
