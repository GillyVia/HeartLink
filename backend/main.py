# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from uuid import uuid4
import joblib
import pandas as pd
import os
import shutil

import models, schemas, crud
from database import SessionLocal, engine
from auth import create_access_token, get_current_user

# =========================================
#  INIT DB & APP
# =========================================
models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="HeartLink API", version="1.0")

# =========================================
#  LOAD MODEL (BRFSS)
# =========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models_ml", "decision_tree_heart_brfss.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model file not found at: {MODEL_PATH}")

loaded = joblib.load(MODEL_PATH)

if isinstance(loaded, dict) and "model" in loaded and "feature_order" in loaded:
    model = loaded["model"]
    FEATURE_ORDER = loaded["feature_order"]
else:
    # fallback (kurang disarankan)
    model = loaded
    FEATURE_ORDER = None

print("✅ BRFSS Decision Tree model loaded successfully!")

# =========================================
#  UPLOAD FOLDER
# =========================================
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

# =========================================
#  CORS
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
#  DB DEP
# =========================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================
#  AUTH
# =========================================
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar.")
    db_user = crud.create_user(db, user)
    return db_user

@app.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.verify_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email atau password salah.")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
    }

# =========================================
#  PROFILE (LOCKED)
# =========================================
@app.get("/profile/me")
def get_profile_me(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")

    foto_url = ""
    if user.foto:
        foto_url = user.foto if user.foto.startswith("http") else f"http://127.0.0.1:8000{user.foto}"

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

@app.put("/profile/me")
async def update_profile_me(
    nik: str = Form(""),
    ttl: str = Form(""),
    jenis_kelamin: str = Form(""),
    alamat: str = Form(""),
    kewarganegaraan: str = Form(""),
    no_hp: str = Form(""),
    foto: UploadFile = File(None),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(db, current_user.id)
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")

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
#  PREDICT (answers[25] -> model BRFSS)
# =========================================
@app.post("/predict", response_model=schemas.PredictResponse)
def predict(
    payload: schemas.PredictRequest,
    current_user=Depends(get_current_user),  # <- tambahkan ini
):
    answers = payload.answers
    if len(answers) != 25:
        raise HTTPException(status_code=400, detail="answers harus panjang 25")

    # validasi 0/1
    for v in answers:
        if v not in (0, 1):
            raise HTTPException(status_code=400, detail="answers hanya boleh 0 atau 1")

    if not FEATURE_ORDER:
        raise HTTPException(
            status_code=500,
            detail="Model tidak menyertakan feature_order. Simpan pkl sebagai dict {'model','feature_order'}."
        )

    # buat dataframe sesuai urutan fitur training
    row = {FEATURE_ORDER[i]: answers[i] for i in range(25)}
    df_input = pd.DataFrame([row])[FEATURE_ORDER]

    # ambil probabilitas kelas positif
    classes = list(getattr(model, "classes_", []))
    if 1 not in classes:
        raise HTTPException(status_code=500, detail=f"Model classes_ tidak mengandung label 1. classes_={classes}")
    pos_index = classes.index(1)

    proba = float(model.predict_proba(df_input)[0][pos_index])

    # threshold risk (bisa kamu tuning dari evaluasi)
    if proba < 0.06:
        risk = "Rendah"
    elif proba < 0.15:
        risk = "Sedang"
    else:
        risk = "Tinggi"

    return {"risk": risk, "probability": round(proba, 3)}

# =========================================
#  RIWAYAT (LOCKED)
# =========================================
@app.post("/riwayat", response_model=schemas.RiwayatResponse)
def save_riwayat(
    data: schemas.RiwayatCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.create_riwayat(db, current_user.id, data)

@app.get("/riwayat", response_model=list[schemas.RiwayatResponse])
def get_riwayat(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_riwayat_by_user(db, current_user.id)

# =========================================
# FAQ (PUBLIC)
# =========================================
@app.get("/faq")
def get_faq():
    return [
        {
            "id": 1,
            "question": "Apa itu HeartLink?",
            "answer": (
                "HeartLink adalah sistem skrining risiko penyakit jantung berbasis web "
                "yang membantu pengguna mengenali potensi risiko penyakit jantung secara dini. "
                "Sistem ini menggunakan teknologi kecerdasan buatan (AI) dengan metode Decision Tree "
                "untuk menganalisis jawaban pengguna terhadap 25 pertanyaan kesehatan yang diadaptasi "
                "dari dataset BRFSS (Behavioral Risk Factor Surveillance System)."
            ),
        },
        {
            "id": 2,
            "question": "Apakah hasil dari HeartLink merupakan diagnosis medis?",
            "answer": (
                "Tidak. HeartLink bukan alat diagnosis medis dan tidak menggantikan peran dokter. "
                "Hasil yang ditampilkan merupakan skrining awal untuk membantu pengguna memahami "
                "tingkat risiko penyakit jantung (rendah, sedang, atau tinggi). "
                "Untuk diagnosis dan penanganan lebih lanjut, pengguna tetap disarankan "
                "untuk berkonsultasi langsung dengan tenaga medis profesional."
            ),
        },
        {
            "id": 3,
            "question": "Bagaimana cara kerja prediksi risiko di HeartLink?",
            "answer": (
                "Pengguna diminta menjawab 25 pertanyaan Ya/Tidak terkait kondisi kesehatan, "
                "gaya hidup, dan riwayat penyakit. Setiap jawaban akan dikonversi menjadi nilai numerik "
                "(Ya = 1, Tidak = 0). Data ini kemudian diproses oleh model AI Decision Tree "
                "yang telah dilatih menggunakan dataset kesehatan BRFSS. "
                "Model akan menghasilkan probabilitas risiko penyakit jantung, "
                "yang selanjutnya diklasifikasikan menjadi risiko rendah, sedang, atau tinggi."
            ),
        },
        {
            "id": 4,
            "question": "Apa arti kategori risiko Rendah, Sedang, dan Tinggi?",
            "answer": (
                "Risiko Rendah menunjukkan kemungkinan kecil terjadinya penyakit jantung berdasarkan data yang diinput. "
                "Risiko Sedang menandakan adanya beberapa faktor risiko yang perlu diwaspadai dan dipantau secara berkala. "
                "Risiko Tinggi menunjukkan bahwa pengguna memiliki banyak faktor risiko, sehingga sangat disarankan "
                "untuk segera melakukan pemeriksaan lanjutan dan berkonsultasi dengan dokter."
            ),
        },
        {
            "id": 5,
            "question": "Apakah data jawaban dan hasil skrining saya aman?",
            "answer": (
                "Ya. HeartLink menyimpan data pengguna secara aman dan hanya dapat diakses oleh akun pengguna itu sendiri. "
                "Setiap hasil skrining disimpan sebagai riwayat pribadi dan dilindungi menggunakan sistem autentikasi "
                "berbasis token (JWT). Data tidak dibagikan kepada pihak lain tanpa izin pengguna."
            ),
        },
        {
            "id": 6,
            "question": "Apakah hasil skrining dapat berubah jika dilakukan ulang?",
            "answer": (
                "Bisa. Hasil skrining sangat bergantung pada jawaban yang diberikan pengguna. "
                "Perubahan gaya hidup seperti berhenti merokok, rutin berolahraga, atau perbaikan pola makan "
                "dapat memengaruhi hasil skrining di masa mendatang."
            ),
        },
    ]


# =========================================
#  MAIN
# =========================================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
