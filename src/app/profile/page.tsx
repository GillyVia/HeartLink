"use client";
import { useEffect, useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
      fetchProfile(parsed.id);
    }
  }, []);

  const fetchProfile = async (id: number) => {
    const res = await fetch(`http://127.0.0.1:8000/profile/${id}`);
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
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, foto: imageUrl, file }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    const formData = new FormData();
    formData.append("nik", profile.nik);
    formData.append("ttl", profile.ttl);
    formData.append("jenis_kelamin", profile.jenisKelamin);
    formData.append("alamat", profile.alamat);
    formData.append("kewarganegaraan", profile.kewarganegaraan);
    formData.append("no_hp", profile.noHp);
    if (profile.file) formData.append("foto", profile.file);

    const res = await fetch(`http://127.0.0.1:8000/profile/${userId}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      const result = await res.json();
      setProfile((prev) => ({
        ...prev,
        foto: result.foto, // foto URL backend disimpan
      }));
      alert("✅ Profil berhasil disimpan!");
      setEditMode(false);
    } else {
      alert("❌ Gagal menyimpan profil");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FCFA] font-sans overflow-hidden relative">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-[#A0C4A9] text-[#1E3A2E] rounded-r-[25px] shadow-md z-20
        transform transition-all duration-500 ease-in-out 
        ${sidebarOpen ? "translate-x-0 opacity-100 w-64" : "-translate-x-full opacity-0 w-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/30">
          <h2 className="text-xl font-bold">Menu</h2>
          <FaBars
            className="text-2xl cursor-pointer hover:scale-110 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 font-semibold">
          <a href="/dashboard" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaHome /> Beranda
          </a>
          <a href="/profil" className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg text-[#1E3A2E] shadow-sm">
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

      {/* KONTEN PROFIL */}
      <main className={`flex-1 p-6 transition-all duration-500 ease-in-out ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {!sidebarOpen && (
          <FaBars
            className="text-3xl text-[#1E3A2E] cursor-pointer mb-4 hover:scale-110 transition"
            onClick={() => setSidebarOpen(true)}
          />
        )}

        {/* HEADER PROFIL */}
        <div className="bg-white/90 rounded-[25px] shadow-md p-6 flex flex-col sm:flex-row items-center justify-between border border-[#DDEBE3]">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profile.foto || "/user.png"}
                alt="Foto profil"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#A0C4A9]"
              />
              <label className="absolute bottom-0 right-0 bg-[#A0C4A9] hover:bg-[#4b6654] text-white text-xs px-2 py-1 rounded-full cursor-pointer transition">
                <FaUpload className="inline-block mr-1" />
                Upload
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-[#1E3A2E]">{profile.nama || "Pengguna"}</h2>
            </div>
          </div>
        </div>

        {/* DATA DIRI */}
        <div className="mt-8 bg-white/90 rounded-[20px] shadow p-6 border border-[#E2EDE6] relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-[#1E3A2E]">Data Diri</h3>
            <button
              onClick={() => (editMode ? handleSave() : setEditMode(true))}
              className="flex items-center text-sm text-[#1E3A2E] hover:text-[#3E6954] transition"
            >
              <FaEdit className="mr-1 text-green-600" /> {editMode ? "Simpan" : "Ubah"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-[#1E3A2E]">
            {(
              [
                ["NIK", "nik"],
                ["Tempat/Tanggal Lahir", "ttl"],
                ["Jenis Kelamin", "jenisKelamin"],
                ["Alamat", "alamat"],
                ["Kewarganegaraan", "kewarganegaraan"],
                ["No HP", "noHp"],
              ] as [string, keyof typeof profile][]
            ).map(([label, key]) => (
              <div key={key} className="flex justify-between pr-6">
                <span className="font-semibold">{label}</span>
                {editMode ? (
                  <input
                    type="text"
                    name={key}
                    value={typeof profile[key] === "string" ? (profile[key] as string) : ""}
                    onChange={handleChange}
                    className="border-b border-[#A0C4A9] focus:outline-none w-2/3 bg-transparent text-right"
                  />
                ) : (
                  <span className="text-right">{(profile as any)[key] || "-"}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
