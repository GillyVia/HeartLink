"use client";
import { useEffect, useState, useRef } from "react";
import {
  FaBars,
  FaHome,
  FaUser,
  FaQuestionCircle,
  FaHistory,
  FaPaperPlane,
  FaEdit,
  FaUpload,
} from "react-icons/fa";

export default function ProfilPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [profile, setProfile] = useState<{
    foto: string;
    nama: string;
    nik: string;
    ttl: string;
    jenisKelamin: string;
    alamat: string;
    kewarganegaraan: string;
    noHp: string;
    file?: File | null;
  }>({
    foto: "",
    nama: "",
    nik: "",
    ttl: "",
    jenisKelamin: "",
    alamat: "",
    kewarganegaraan: "",
    noHp: "",
    file: null,
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`http://127.0.0.1:8000/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setProfile((prev) => ({
        ...prev,
        foto: data.foto || "",
        nama: data.first_name || "",
        nik: data.nik || "",
        ttl: data.ttl || "",
        jenisKelamin: data.jenis_kelamin || "",
        alamat: data.alamat || "",
        kewarganegaraan: data.kewarganegaraan || "",
        noHp: data.no_hp || "",
      }));
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (profile.foto) {
      const confirmReplace = window.confirm("Apakah Anda ingin mengganti foto profil?");
      if (!confirmReplace) {
        (e.target as HTMLInputElement).value = "";
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, foto: imageUrl, file }));
      void uploadProfilePhoto(file);
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, foto: imageUrl, file }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Harap login ulang.");
      return;
    }

    const formData = new FormData();
    formData.append("nik", profile.nik);
    formData.append("ttl", profile.ttl);
    formData.append("jenis_kelamin", profile.jenisKelamin);
    formData.append("alamat", profile.alamat);
    formData.append("kewarganegaraan", profile.kewarganegaraan);
    formData.append("no_hp", profile.noHp);
    if (profile.file) formData.append("foto", profile.file);

    const res = await fetch(`http://127.0.0.1:8000/profile/me`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      setProfile((prev) => ({
        ...prev,
        foto: result.foto,
      }));
      alert("✅ Profil berhasil disimpan!");
      setEditMode(false);
    } else {
      alert("❌ Gagal menyimpan profil");
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    if (!userId) {
      alert("ID user tidak ditemukan. Harap login ulang.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Harap login ulang.");
      return;
    }

    const formData = new FormData();
    formData.append("foto", file);

    try {
      const res = await fetch(`http://127.0.0.1:8000/profile/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setProfile((prev) => ({ ...prev, foto: result.foto }));
        alert("✅ Foto profil berhasil diperbarui.");
      } else {
        alert("❌ Gagal mengunggah foto profil.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan saat mengunggah foto.");
    }
  };

  return (
    <div className="min-h-screen flex app-bg font-sans overflow-hidden relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#A0C4A9] text-[#1E3A2E] rounded-r-[25px] shadow-md z-20 transform transition-all duration-500 ease-in-out 
        ${sidebarOpen ? "translate-x-0 opacity-100 w-64" : "-translate-x-full opacity-0 w-0"}`}
      >
        <div className="flex items-center justify-center px-4 py-4 border-b border-white/30">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 font-semibold">
          <a href="/dashboard" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaHome /> Beranda
          </a>
          <a href="/profile" className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <FaUser /> Profil
          </a>
          <a href="/faq" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaQuestionCircle /> FAQ
          </a>
          <a href="/riwayat" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaHistory /> Riwayat
          </a>
          <a href="/hubungi-kami" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaPaperPlane /> Hubungi Kami
          </a>
        </nav>
      </aside>

      <main
        className={`flex-1 p-6 transition-all duration-500 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <FaBars
          className="text-3xl text-[#1E3A2E] cursor-pointer mb-4 hover:scale-110 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="profile-header-wrapper mt-2 mb-6">
          <div className="profile-header-outline">
            <div className="relative">
              <img
                src={profile.foto || "/user.png"}
                alt="Foto profil"
                className="avatar-large"
              />
            <label
  className="
    absolute -bottom-3 left-0 inline-flex items-center gap-2
    px-4 py-2 rounded-full text-white font-semibold
    bg-[#7FD7A2] hover:bg-[#6BC894]
    shadow-md hover:shadow-lg
    transition-all duration-200
    active:bg-[#3B6649] active:shadow-md active:scale-[0.98]
    focus-within:outline-none focus-within:ring-2 focus-within:ring-[#3B6649]/40
    cursor-pointer select-none
  "
>

                <FaUpload />
                <span className="hidden sm:inline">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-[#1E3A2E]">
                {profile.nama || "Pengguna"}
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-8 relative">
          <div className="data-card font-lato">
            <h3 className="text-xl font-bold text-[#1E3A2E] mb-2">Data diri</h3>
            <div
              className="edit-small"
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
            >
              <FaEdit />{" "}
              <span className="hidden sm:inline">{editMode ? "Simpan" : "ubah"}</span>
            </div>

            <div className="mt-4">
              {(
                [
                  ["NIK", "nik"],
                  ["Nama", "nama"],
                  ["Tempat/Tanggal Lahir", "ttl"],
                  ["Jenis Kelamin", "jenisKelamin"],
                  ["Alamat", "alamat"],
                  ["Kewarganegaraan", "kewarganegaraan"],
                  ["No Hp", "noHp"],
                ] as [string, keyof typeof profile][]
              ).map(([label, key]) => (
                <div key={key} className="data-row">
                  <div className="label-col">
                    <span className="data-label">{label}</span>
                  </div>
                  <div className="colon">:</div>
                  <div className="value-col">
                    {editMode ? (
                      <input
                        type="text"
                        name={key}
                        value={typeof profile[key] === "string" ? (profile[key] as string) : ""}
                        onChange={handleChange}
                        className="value-input"
                      />
                    ) : (
                      <span className="value-text">{(profile as any)[key] || "-"}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
