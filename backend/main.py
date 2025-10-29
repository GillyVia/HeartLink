from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import os
import shutil
import models, schemas, crud
from database import SessionLocal, engine

# =========================================
#  INISIALISASI DATABASE & APP
# =========================================
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="HeartLink API", version="1.0")

# Folder upload foto profil
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# =========================================
#  KONFIGURASI CORS
# =========================================
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================================
#  KONEKSI DATABASE
# =========================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================
#  ENDPOINT PROFIL
# =========================================
@app.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")
    
    foto_url = ""
    if user.foto:
        if user.foto.startswith("http"):
            foto_url = user.foto
        else:
            foto_url = f"http://127.0.0.1:8000{user.foto}"

    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "nik": user.nik,
        "ttl": user.ttl,
        "jenis_kelamin": user.jenis_kelamin,
        "alamat": user.alamat,
        "kewarganegaraan": user.kewarganegaraan,
        "no_hp": user.no_hp,
        "foto": foto_url,
    }


@app.put("/profile/{user_id}")
async def update_profile(
    user_id: int,
    nik: str = Form(""),
    ttl: str = Form(""),
    jenis_kelamin: str = Form(""),
    alamat: str = Form(""),
    kewarganegaraan: str = Form(""),
    no_hp: str = Form(""),
    foto: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")

    # Simpan foto profil jika dikirim
    if foto:
        filename = f"{uuid4().hex}_{foto.filename}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        user.foto = f"/uploads/{filename}"

    user.nik = nik
    user.ttl = ttl
    user.jenis_kelamin = jenis_kelamin
    user.alamat = alamat
    user.kewarganegaraan = kewarganegaraan
    user.no_hp = no_hp

    db.commit()
    db.refresh(user)
    return {"message": "Profil berhasil diperbarui", "foto": f"http://127.0.0.1:8000{user.foto}"}

# =========================================
#  MODEL AI (dummy)
# =========================================
class Input(BaseModel):
    answers: list[int]

@app.post("/predict")
def predict(data: Input):
    total = sum(data.answers)
    if total <= 8:
        risk = "Rendah"
    elif 9 <= total <= 17:
        risk = "Sedang"
    else:
        risk = "Tinggi"
    return {"risk": risk}

# =========================================
#  AUTENTIKASI
# =========================================
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    return crud.create_user(db, user)

@app.post("/login", response_model=schemas.UserResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.verify_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah.")
    return user

# =========================================
#  MAIN ENTRY
# =========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
