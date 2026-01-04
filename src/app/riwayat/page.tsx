  "use client";

  import { useEffect, useState, useRef } from "react";
  import { useRouter } from "next/navigation";
  import {
    FaCalendarAlt,
    FaHeartbeat,
    FaBars,
    FaHome,
    FaUser,
    FaQuestionCircle,
    FaHistory,
    FaPaperPlane,
  } from "react-icons/fa";
  import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
  } from "recharts";

  export default function RiwayatPage() {
    const [riwayat, setRiwayat] = useState<any[]>([]);
    const [periode, setPeriode] = useState("all");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Tutup sidebar jika klik di luar
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
          setSidebarOpen(false);
        }
      };
      if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarOpen]);

    // Ambil data riwayat dari backend (TERKUNCI JWT)
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const fetchRiwayat = async () => {
        try {
          const res = await fetch("http://127.0.0.1:8000/riwayat", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();

            // ✅ Normalisasi field supaya kompatibel walau backend beda nama
            const normalized = Array.isArray(data)
              ? data.map((r: any) => ({
                  ...r,
                  // date bisa bernama "date" atau "tanggal"
                  date: r.date ?? r.tanggal ?? r.created_at ?? new Date().toISOString(),
                  // answers bisa bernama "answers" (yang kita target)
                  answers: Array.isArray(r.answers)
                    ? r.answers
                    : Array.isArray(r.answers_25)
                    ? r.answers_25
                    : Array.isArray(r.answers25)
                    ? r.answers25
                    : [],
                }))
              : [];

            setRiwayat(normalized);
          } else if (res.status === 401) {
            // token invalid/expired
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
          } else {
            setRiwayat([]);
          }
        } catch (err) {
          console.error(err);
          setRiwayat([]);
        }
      };

      void fetchRiwayat();
    }, [router]);

    const formatTanggal = (v: any) => {
      const d = new Date(v);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID");
    };

    const formatWaktu = (v: any) => {
      const d = new Date(v);
      return isNaN(d.getTime()) ? "-" : d.toLocaleTimeString("id-ID");
    };

    // PERTANYAAN BARU: sesuaikan dengan fitur BRFSS (25)
    // (UI tidak berubah, hanya teks pertanyaan)
    const questions = [
      "Apakah usia Anda 55 tahun ke atas?",
      "Apakah Anda berjenis kelamin pria?",
      "Apakah kondisi kesehatan umum Anda buruk/cukup buruk?",
      "Apakah dalam 30 hari terakhir Anda sering sakit fisik (≥ 14 hari)?",
      "Apakah dalam 30 hari terakhir kesehatan mental Anda sering terganggu (≥ 14 hari)?",
      "Apakah Anda tidur kurang dari 6 jam per hari?",
      "Apakah Anda pernah didiagnosis asma?",
      "Apakah Anda pernah didiagnosis COPD/emfisema/bronkitis kronis?",
      "Apakah Anda pernah didiagnosis penyakit ginjal?",
      "Apakah Anda menderita diabetes?",
      "Apakah Anda saat ini perokok aktif?",
      "Apakah Anda saat ini menggunakan rokok elektrik/vape?",
      "Apakah Anda mengonsumsi alkohol (peminum alkohol)?",
      "Apakah Anda kurang aktivitas fisik (tidak rutin berolahraga)?",
      "Apakah Anda obesitas (BMI ≥ 30)?",
      "Apakah Anda pernah didiagnosis kanker kulit?",
      "Apakah Anda pernah didiagnosis kanker lainnya?",
      "Apakah Anda pernah didiagnosis depresi?",
      "Apakah Anda pernah didiagnosis arthritis/rematik?",
      "Apakah Anda memiliki gangguan pendengaran?",
      "Apakah Anda memiliki gangguan penglihatan?",
      "Apakah Anda kesulitan konsentrasi/mengingat?",
      "Apakah Anda kesulitan berjalan/naik tangga?",
      "Apakah Anda kesulitan mengurus diri (mandi/berpakaian)?",
      "Apakah Anda kesulitan melakukan aktivitas/urusan sehari-hari di luar rumah?",
    ];

    // Filter periode
    const filtered = (() => {
      const now = new Date();
      if (periode === "all") return riwayat;

      return riwayat.filter((item) => {
        const d = new Date(item.date);
        if (periode === "week") {
          const minus7 = new Date();
          minus7.setDate(now.getDate() - 7);
          return d >= minus7;
        }
        if (periode === "month") {
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        if (periode === "year") return d.getFullYear() === now.getFullYear();
        return true;
      });
    })();

    const grafikData = filtered.map((i) => ({
      date: formatTanggal(i.date),
      risk: i.risk === "Rendah" ? 1 : i.risk === "Sedang" ? 2 : 3,
    }));

    return (
      <div className="min-h-screen bg-[#EAF3EF] flex flex-col items-center relative">
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
            <a href="/profile" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
              <FaUser /> Profil
            </a>
            <a href="/faq" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
              <FaQuestionCircle /> FAQ
            </a>
            <a href="/riwayat" className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <FaHistory /> Riwayat
            </a>
            <a href="/hubungi-kami" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
              <FaPaperPlane /> Hubungi Kami
            </a>
          </nav>
        </aside>

        <div className="w-full max-w-5xl flex justify-between items-center mb-6 mt-6 px-6">
          <FaBars
            className="text-3xl text-[#1E3A2E] cursor-pointer hover:scale-110 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h1 className="text-3xl font-extrabold text-[#1E3A2E]">
            Riwayat Skrining
          </h1>
          <div className="w-6" />
        </div>

        <select
          className="px-4 py-2 rounded-xl border bg-white shadow mb-8"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
        >
          <option value="all">Semua</option>
          <option value="week">7 Hari Terakhir</option>
          <option value="month">Bulan Ini</option>
          <option value="year">Tahun Ini</option>
        </select>

        <div className="w-full max-w-3xl bg-white p-6 rounded-3xl shadow-lg mb-10 border border-[#CFE5DB]">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-[#1E3A2E]">
            <FaHeartbeat /> Grafik Risiko
          </h2>
          {grafikData.length === 0 ? (
            <p className="text-gray-500 italic text-center py-10">
              Belum ada data grafik.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={grafikData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis ticks={[1, 2, 3]} />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#1E3A2E" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="w-full max-w-3xl space-y-6 px-6 pb-10">
          {filtered.length === 0 ? (
            <p className="text-gray-500 italic text-center">
              Belum ada riwayat skrining.
            </p>
          ) : (
            filtered
              .slice()
              .reverse()
              .map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-3xl shadow-md border border-[#D6E8DE] hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-[#1E3A2E]">{formatTanggal(item.date)}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        {formatWaktu(item.date) !== "-" && <FaCalendarAlt />}
                        {formatWaktu(item.date) !== "-" ? formatWaktu(item.date) : "-"}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-white font-bold ${
                        item.risk === "Rendah"
                          ? "bg-green-600"
                          : item.risk === "Sedang"
                          ? "bg-yellow-500"
                          : "bg-red-600"
                      }`}
                    >
                      {item.risk}
                    </span>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-[#164A3C] font-semibold">
                      Lihat Detail Jawaban
                    </summary>
                    <div className="mt-3 bg-[#F4FAF7] rounded-xl p-4 max-h-64 overflow-y-auto">
                      {item.answers?.map((ans: number, i: number) => (
                        <div key={i} className="border-b py-2">
                          <p className="font-bold text-sm text-gray-800">
                            {questions[i] || `Pertanyaan ${i + 1}`}
                          </p>
                          <p className="text-[#1E3A2E] font-semibold">
                            {ans === 1 ? "Ya" : "Tidak"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              ))
          )}
        </div>
      </div>
    );
  }
