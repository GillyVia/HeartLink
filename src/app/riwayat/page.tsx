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

  // Ambil data riwayat
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("riwayat") || "[]");
    setRiwayat(data);
  }, []);

  // Format tanggal & waktu
  const formatTanggal = (v: any) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID");
  };
  const formatWaktu = (v: any) => {
    const d = new Date(v);
    return isNaN(d.getTime()) ? "-" : d.toLocaleTimeString("id-ID");
  };

  // Semua pertanyaan
  const questions = [
    "Apakah Anda berusia di atas 50 tahun?",
    "Apakah Anda berjenis kelamin pria?",
    "Apakah Anda memiliki riwayat keluarga dengan penyakit jantung?",
    "Apakah Anda merokok secara aktif?",
    "Apakah Anda sering mengonsumsi alkohol?",
    "Apakah Anda kurang berolahraga (< 30 menit per hari)?",
    "Apakah Anda sering makan makanan tinggi lemak?",
    "Apakah Anda pernah didiagnosis hipertensi?",
    "Apakah kadar kolesterol Anda tinggi?",
    "Apakah Anda menderita diabetes?",
    "Apakah berat badan Anda berlebih (obesitas)?",
    "Apakah Anda pernah merasakan nyeri dada saat beraktivitas?",
    "Apakah jantung Anda sering berdebar tanpa sebab?",
    "Apakah Anda cepat lelah saat aktivitas ringan?",
    "Apakah pergelangan kaki Anda sering bengkak?",
    "Apakah Anda sering mengalami stres berat?",
    "Apakah Anda tidur kurang dari 6 jam setiap malam?",
    "Apakah Anda minum kopi lebih dari 3 gelas per hari?",
    "Apakah Anda jarang melakukan pemeriksaan kesehatan rutin?",
    "Apakah nyeri dada Anda menjalar ke leher atau lengan kiri?",
    "Apakah Anda pernah pingsan atau hampir pingsan?",
    "Apakah Anda pernah merasakan detak jantung tidak teratur?",
    "Apakah Anda sering sesak napas saat tidur terlentang?",
    "Apakah Anda sering merasa mual dan berkeringat dingin disertai nyeri dada?",
    "Apakah tekanan darah Anda tidak stabil?",
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
      if (periode === "month")
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
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
      {/* Overlay klik luar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
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

      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 mt-6 px-6">
        <FaBars
          className="text-3xl text-[#1E3A2E] cursor-pointer hover:scale-110 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <h1 className="text-3xl font-extrabold text-[#1E3A2E]">
          Riwayat Skrining
        </h1>
        <div className="w-6" /> {/* spacer */}
      </div>

      {/* FILTER */}
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

      {/* GRAFIK */}
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

      {/* LIST RIWAYAT */}
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
                        <p className="font-bold text-sm text-gray-800">{questions[i]}</p>
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
