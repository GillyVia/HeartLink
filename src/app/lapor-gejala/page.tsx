"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function LaporGejala() {
  const router = useRouter();

  // === 25 Pertanyaan Gejala ===
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

  // === Bobot pertanyaan kritis ===
  const criticalIndices = [3, 4, 5, 7, 8, 9, 11, 19, 24];

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(25).fill(0));
  const [score, setScore] = useState(0);

  // === Handle Jawaban ===
  const handleAnswer = async (value: number) => {
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
      await handleSubmit(updated);
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
    riskLabel === "Rendah"
      ? "text-green-700"
      : riskLabel === "Sedang"
      ? "text-yellow-600"
      : "text-red-700";

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
      <div className="bg-[#A9CDBB] relative rounded-[30px] p-6 w-full max-w-5xl shadow-lg overflow-hidden">
        {/* Progress bar Risiko (top gradient) */}
        <div className="absolute top-0 left-0 w-full h-6 bg-gray-200 rounded-t-[30px]" />
        <motion.div
          className={`absolute top-0 left-0 h-6 bg-gradient-to-r ${riskColor} rounded-t-[30px]`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Circular arrows at top-left/top-right */}
        <div className="absolute top-4 left-4">
          <div
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => index > 0 && setIndex(index - 1)}
          >
            <FaArrowLeft />
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => index < questions.length - 1 && setIndex(index + 1)}
          >
            <FaArrowRight />
          </div>
        </div>

        {/* Area Pertanyaan (full card, hospital bg) */}
        <div
          className="flex justify-center items-center min-h-[480px] bg-center rounded-[20px] p-8 relative"
          style={{
            backgroundImage: `url('/latar.jpg')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 60%',
          }}
        >
          {/* overlay for better text contrast */}
          <div className="absolute inset-0 bg-black/20 rounded-[20px] pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-2xl w-full"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A2E] mb-6 px-6 drop-shadow-md">
                {questions[index]}
              </h2>

              {/* Tombol Jawaban (pills besar) */}
              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={() => handleAnswer(1)}
                  className="bg-white w-56 md:w-80 py-4 rounded-[36px] text-lg font-bold shadow-md text-[#1E3A2E]"
                >
                  YA
                </button>
                <button
                  onClick={() => handleAnswer(0)}
                  className="bg-white w-56 md:w-80 py-4 rounded-[36px] text-lg font-bold shadow-md text-[#1E3A2E]"
                >
                  TIDAK
                </button>
              </div>

              {/* Indikator risiko real-time */}
              <div className="mt-6 text-sm text-gray-700 italic">
                Risiko sementara: {" "}
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
      </div>
    </div>
  );
}
