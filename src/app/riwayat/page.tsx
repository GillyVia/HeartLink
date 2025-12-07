"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaHeartbeat } from "react-icons/fa";
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

  // === FORMAT TANGGAL ===
  const formatTanggal = (value: any) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("id-ID");
  };

  const formatWaktu = (value: any) => {
    const d = new Date(value);
    return isNaN(d.getTime()) ? "-" : d.toLocaleTimeString("id-ID");
  };

  // === Ambil riwayat dari localStorage ===
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("riwayat") || "[]");
    setRiwayat(data);
  }, []);

  // === Semua pertanyaan ===
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

  // === FILTER PERIODE ===
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
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      }

      if (periode === "year") {
        return d.getFullYear() === now.getFullYear();
      }

      return true;
    });
  })();

  // === Data grafik ===
  const grafikData = filtered.map((item) => ({
    date: formatTanggal(item.date),
    risk: item.risk === "Rendah" ? 1 : item.risk === "Sedang" ? 2 : 3,
  }));

  return (
    <div className="min-h-screen bg-[#EAF3EF] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-[#1E3A2E] mb-6">
        Riwayat Skrining
      </h1>

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
      <div className="w-full max-w-3xl space-y-6">
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
                {/* Header Card */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-[#1E3A2E]">
                      {formatTanggal(item.date)}
                    </p>

                    {/* Waktu HANYA muncul jika valid */}
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      {formatWaktu(item.date) !== "-" && <FaCalendarAlt />}
                      {formatWaktu(item.date) !== "-" ? formatWaktu(item.date) : "-"}
                    </p>
                  </div>

                  {/* BADGE */}
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

                {/* DETAIL JAWABAN */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-[#164A3C] font-semibold">
                    Lihat Detail Jawaban
                  </summary>

                  <div className="mt-3 bg-[#F4FAF7] rounded-xl p-4 max-h-64 overflow-y-auto">
                    {item.answers?.map((ans: number, i: number) => (
                      <div key={i} className="border-b py-2">
                        <p className="font-bold text-sm text-gray-800">
                          {questions[i]}
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
