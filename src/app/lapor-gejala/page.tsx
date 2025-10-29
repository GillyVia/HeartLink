"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function LaporGejala() {
  const router = useRouter();

  // === 25 pertanyaan ===
  const questions = [
    "Apakah Anda berusia di atas 50 tahun?",
    "Apakah Anda berjenis kelamin pria?",
    "Apakah Anda memiliki riwayat keluarga dengan penyakit jantung?",
    "Apakah Anda merokok secara aktif?", // KRITIS
    "Apakah Anda sering mengonsumsi alkohol?", // KRITIS
    "Apakah Anda kurang berolahraga (< 30 menit per hari)?", // KRITIS
    "Apakah Anda sering makan makanan tinggi lemak?",
    "Apakah Anda pernah didiagnosis hipertensi?", // KRITIS
    "Apakah kadar kolesterol Anda tinggi?", // KRITIS
    "Apakah Anda menderita diabetes?", // KRITIS
    "Apakah berat badan Anda berlebih (obesitas)?",
    "Apakah Anda pernah merasakan nyeri dada saat beraktivitas?", // KRITIS
    "Apakah jantung Anda sering berdebar tanpa sebab?",
    "Apakah Anda cepat lelah saat aktivitas ringan?",
    "Apakah pergelangan kaki Anda sering bengkak?",
    "Apakah Anda sering mengalami stres berat?",
    "Apakah Anda tidur kurang dari 6 jam setiap malam?",
    "Apakah Anda minum kopi lebih dari 3 gelas per hari?",
    "Apakah Anda jarang melakukan pemeriksaan kesehatan rutin?",
    "Apakah nyeri dada Anda menjalar ke leher atau lengan kiri?", // KRITIS
    "Apakah Anda pernah pingsan atau hampir pingsan?",
    "Apakah Anda pernah merasakan detak jantung tidak teratur?",
    "Apakah Anda sering sesak napas saat tidur terlentang?",
    "Apakah Anda sering merasa mual dan berkeringat dingin disertai nyeri dada?", // KRITIS
    "Apakah tekanan darah Anda tidak stabil?", // KRITIS
  ];

  // === Bobot pertanyaan kritis ===
  const criticalIndices = [3, 4, 5, 7, 8, 9, 11, 19, 24];

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(25).fill(0));
  const [score, setScore] = useState(0);

  const handleAnswer = (value: number) => {
    const updated = [...answers];
    updated[index] = value;

    // hitung skor
    let newScore = score;
    if (value === 1) {
      if (criticalIndices.includes(index)) {
        newScore += 3; // jawaban kritis berbobot 3
      } else {
        newScore += 1; // jawaban biasa berbobot 1
      }
    }

    setAnswers(updated);
    setScore(newScore);

    // 🧠 Early Stop Logic
    if (newScore >= 12) {
      // nilai total cukup untuk menyimpulkan risiko tinggi
      handleSubmit(updated, newScore);
      return;
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      handleSubmit(updated, newScore);
    }
  };

  const handleSubmit = async (data: number[], scoreVal: number) => {
    let risk = "Rendah";
    if (scoreVal <= 8) risk = "Rendah";
    else if (scoreVal <= 14) risk = "Sedang";
    else risk = "Tinggi";

    router.push(`/hasil-skrining?risk=${risk}`);
  };

  // Progress visual (0–100%)
  const progress = ((index + 1) / questions.length) * 100;

  // Warna dinamis progress bar (berdasarkan skor)
  const riskColor =
    score <= 5
      ? "from-green-400 to-green-300"
      : score <= 10
      ? "from-yellow-300 to-yellow-200"
      : score <= 15
      ? "from-orange-400 to-orange-300"
      : "from-red-500 to-red-400";

  return (
    <div className="min-h-screen bg-[#EAF3EF] flex flex-col items-center py-8 px-4 transition-all duration-300">
      {/* ===== Header ===== */}
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

      {/* ===== Container Pertanyaan ===== */}
      <div className="bg-[#A9CDBB] relative rounded-[30px] p-10 w-full max-w-5xl shadow-lg overflow-hidden">
        {/* Progress bar Risiko */}
        <div className="absolute top-0 left-0 w-full h-3 bg-gray-200 rounded-t-[30px]" />
        <motion.div
          className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${riskColor} rounded-t-[30px]`}
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />

        {/* Area Pertanyaan */}
        <div className="flex justify-center items-center h-[420px] bg-[url('/hospital-bg.png')] bg-center bg-cover rounded-[20px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-[#1E3A2E] mb-8 px-6 drop-shadow-md">
                {questions[index]}
              </h2>

              {/* Tombol Jawaban */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => handleAnswer(1)}
                  className="bg-white px-10 py-3 rounded-full text-lg font-bold shadow hover:bg-green-100 transition"
                >
                  YA
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="bg-white px-10 py-3 rounded-full text-lg font-bold shadow hover:bg-red-100 transition"
                >
                  TIDAK
                </button>
              </div>

              {/* Indikator risiko real-time */}
              <div className="mt-6 text-sm text-gray-700 italic">
                Risiko sementara:{" "}
                <span
                  className={
                    score <= 5
                      ? "text-green-700 font-semibold"
                      : score <= 10
                      ? "text-yellow-700 font-semibold"
                      : score <= 15
                      ? "text-orange-700 font-semibold"
                      : "text-red-700 font-semibold"
                  }
                >
                  {score <= 5
                    ? "Rendah"
                    : score <= 10
                    ? "Sedang"
                    : score <= 15
                    ? "Cukup Tinggi"
                    : "Tinggi"}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigasi panah */}
        <div className="absolute bottom-6 right-8 text-xl text-gray-700 flex gap-4">
          {index > 0 && (
            <FaArrowLeft
              className="cursor-pointer hover:text-[#1E3A2E] transition"
              onClick={() => setIndex(index - 1)}
            />
          )}
          {index < questions.length - 1 && (
            <FaArrowRight
              className="cursor-pointer hover:text-[#1E3A2E] transition"
              onClick={() => setIndex(index + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
