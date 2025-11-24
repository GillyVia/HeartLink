from sqlalchemy import create_engine

DATABASE_URL = "mysql+pymysql://root:@localhost/heartlink"

try:
    engine = create_engine(DATABASE_URL)
    conn = engine.connect()
    print("KONEKSI BERHASIL!")
    conn.close()
except Exception as e:
    print("GAGAL TERHUBUNG KE DATABASE:")
    print(e)
