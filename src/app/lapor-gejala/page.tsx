"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function LaporGejala() {
  const router = useRouter();

  // 25 pertanyaan (BRFSS aligned)
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

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(25).fill(0));
  const [selected, setSelected] = useState<number | null>(null); // 1=Ya, 0=Tidak

  const handleAnswer = (value: number) => {
    setSelected(value);

    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);

    setTimeout(() => {
    setSelected(null);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      void handleSubmit(updated);
    }
   }, 180);
  };

  const handleSubmit = async (data: number[]) => {
    // simpan local (opsional) – tetap boleh
    const localItem = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      answers: data,
      questions,
    };
    const existing = JSON.parse(localStorage.getItem("riwayat_local") || "[]");
    existing.push(localItem);
    localStorage.setItem("riwayat_local", JSON.stringify(existing));

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login dulu.");
      router.push("/login");
      return;
    }

    try {
      // 1) PREDICT ke backend
      const predRes = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: data }),
      });

      if (predRes.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
        return;
      }

      if (!predRes.ok) {
        const err = await predRes.json().catch(() => ({}));
        console.error("Predict error:", err);
        alert("Gagal memproses prediksi.");
        return;
      }

      const pred = await predRes.json(); // { risk, probability }
      const risk = pred.risk || "Tidak diketahui";
      const prob = typeof pred.probability === "number" ? pred.probability : 0;

      // 2) SIMPAN RIWAYAT terkunci user login
const saveRes = await fetch("http://127.0.0.1:8000/riwayat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ risk, probability: prob, answers: data }),
});

if (!saveRes.ok) {
  const e = await saveRes.json().catch(() => ({}));
  console.error("Save riwayat error:", saveRes.status, e);
  alert("Prediksi berhasil, tapi gagal menyimpan riwayat.");
}
      // 3) pindah ke hasil
      router.push(`/hasil-skrining?risk=${encodeURIComponent(risk)}&prob=${encodeURIComponent(String(prob))}`);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Terjadi kesalahan saat mengirim data.");
    }
  };

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#EAF3EF] flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-lg font-bold text-[#1E3A2E]"
        >
          <FaArrowLeft /> Pertanyaan
        </button>

        <p className="font-semibold text-gray-700">
          Soal {index + 1} / {questions.length}
        </p>
      </div>

      {/* CARD */}
      <div className="bg-[#A9CDBB] relative rounded-[30px] p-6 w-full max-w-5xl shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-6 bg-gray-200 rounded-t-[30px]" />

        <motion.div
          className="absolute top-0 left-0 h-6 bg-gradient-to-r from-green-400 to-green-300 rounded-t-[30px]"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />

        <div className="absolute top-4 left-4 z-20">
          <button
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
            onClick={() => index > 0 && setIndex(index - 1)}
          >
            <FaArrowLeft />
          </button>
        </div>

        <div className="absolute top-4 right-4 z-20">
          <button
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
            onClick={() => index < questions.length - 1 && setIndex(index + 1)}
          >
            <FaArrowRight />
          </button>
        </div>

        <div
          className="flex justify-center items-center min-h-[520px] rounded-[20px] p-8 relative"
          style={{
            backgroundImage: `url('/Rumahsakit.png')`,
            backgroundSize: "85%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.55,
          }}
        >
          <div className="absolute inset-0 bg-black/10 rounded-[20px]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-2xl w-full relative z-20"
            >
              <h2
                className="text-2xl md:text-3xl font-extrabold mb-6 bg-white/40 backdrop-blur-sm px-6 py-3 rounded-xl inline-block"
              >
                <span className="text-black drop-shadow-none">
                  {questions[index]}
                </span>
              </h2>

              <div className="flex flex-col items-center gap-6 mt-6">
                <button
                  onClick={() => handleAnswer(1)}
                  className={`backdrop-blur-sm w-56 md:w-80 py-4 rounded-[36px] text-lg font-bold shadow-md transition
    ${selected === 1 ? "bg-green-600 text-white" : "bg-white/80 text-[#1E3A2E] hover:bg-green-200 hover:text-[#1E3A2E]"}
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500`}
                >
                  YA
                </button>

                <button
                  onClick={() => handleAnswer(0)}
                  className={`backdrop-blur-sm w-56 md:w-80 py-4 rounded-[36px] text-lg font-bold shadow-md transition
    ${selected === 0 ? "bg-red-600 text-white" : "bg-white/80 text-[#1E3A2E] hover:bg-red-200 hover:text-[#1E3A2E]"}
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500`}
                >
                  TIDAK
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
