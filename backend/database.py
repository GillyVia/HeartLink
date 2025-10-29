from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Sesuaikan user, password, host, port, dan database MySQL kamu
DATABASE_URL = "mysql+mysqlconnector://root:@localhost:3306/heartlink"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
