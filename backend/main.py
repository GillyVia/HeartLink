from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import joblib
import numpy as np
import pandas as pd
import os
import shutil
import models, schemas, crud
from database import SessionLocal, engine

# =========================================
#  INISIALISASI DATABASE & APP
# =========================================
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="HeartLink API", version="1.0")

# =========================================
#  SETUP PATH & LOAD MODEL DECISION TREE
# =========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models_ml", "decision_tree_heart_v2.pkl")

# Pastikan file model ada
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model file not found at: {MODEL_PATH}")

model = joblib.load(MODEL_PATH)
print("✅ Decision Tree model loaded successfully!")

# =========================================
#  FOLDER UPLOAD FOTO
# =========================================
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
#  MODEL AI - Decision Tree
# =========================================
class Input(BaseModel):
    age: int
    gender: int
    height: int
    weight: int
    ap_hi: int
    ap_lo: int
    cholesterol: int
    gluc: int
    smoke: int
    alco: int
    active: int

@app.post("/predict")
def predict(data: Input):
    # Ubah input ke DataFrame
    df_input = pd.DataFrame([data.dict()])

    # Prediksi probabilitas
    proba = float(model.predict_proba(df_input)[0][1])

    # --- Normalisasi prediksi agar lebih seimbang ---
    # Model Decision Tree kadang menghasilkan nilai ekstrem 0.0 / 1.0
    # Kita haluskan agar zona "Sedang" muncul lebih realistis
    calibrated_proba = np.clip(0.5 * proba + 0.25, 0.0, 1.0)

    # Tentukan tingkat risiko
    if calibrated_proba < 0.4:
        risk = "Rendah"
    elif calibrated_proba < 0.65:
        risk = "Sedang"
    else:
        risk = "Tinggi"

    return {
        "risk": risk,
        "probability": round(calibrated_proba, 3)
    }

# =========================================
#  ENDPOINT RIWAYAT SKRINNING (BARU)
# =========================================
@app.post("/riwayat", response_model=schemas.RiwayatResponse)
def save_riwayat(data: schemas.RiwayatCreate, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")
    return crud.create_riwayat(db, data)

@app.get("/riwayat/{user_id}", response_model=list[schemas.RiwayatResponse])
def get_riwayat(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")
    return crud.get_riwayat_by_user(db, user_id)

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
