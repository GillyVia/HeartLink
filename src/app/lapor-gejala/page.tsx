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

  const criticalIndices = [3, 4, 5, 7, 8, 9, 11, 19, 24];

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(25).fill(0));
  const [score, setScore] = useState(0);

  const handleAnswer = (value: number) => {
    const updated = [...answers];
    updated[index] = value;

    let newScore = score;
    if (value === 1) {
      newScore += criticalIndices.includes(index) ? 3 : 1;
    }

    setAnswers(updated);
    setScore(newScore);

    // Early stop
    if (newScore >= 12) {
      handleSubmit(updated, newScore);
      return;
    }

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      handleSubmit(updated, newScore);
    }
  };

  // ============================================
  //  SUBMIT DATA
  // ============================================
  const handleSubmit = async (data: number[], scoreVal: number) => {
    let risk = "Rendah";
    if (scoreVal <= 8) risk = "Rendah";
    else if (scoreVal <= 14) risk = "Sedang";
    else risk = "Tinggi";

    // ========== SIMPAN LOCAL STORAGE ==========
    const item = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      score: scoreVal,
      risk,
      answers: data,
      questions,
    };

    const existing = JSON.parse(localStorage.getItem("riwayat") || "[]");
    existing.push(item);
    localStorage.setItem("riwayat", JSON.stringify(existing));

    // ========== SIMPAN KE BACKEND ==========
    try {
      const userId = localStorage.getItem("user_id");

      await fetch("http://localhost:8000/riwayat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          score: scoreVal,
          hasil: risk,
          tanggal: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Gagal kirim ke server:", err);
    }

    // ========== PINDAH KE HALAMAN HASIL ==========
    router.push(`/hasil-skrining?risk=${risk}`);
  };

  const progress = ((index + 1) / questions.length) * 100;

  // warna progress sesuai tingkat risiko
  const riskColor =
    score <= 5
      ? "from-green-400 to-green-300"
      : score <= 10
      ? "from-yellow-300 to-yellow-200"
      : score <= 15
      ? "from-orange-400 to-orange-300"
      : "from-red-500 to-red-400";

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

        {/* progress background */}
        <div className="absolute top-0 left-0 w-full h-6 bg-gray-200 rounded-t-[30px]" />

        {/* progress bar */}
        <motion.div
          className={`absolute top-0 left-0 h-6 bg-gradient-to-r ${riskColor} rounded-t-[30px]`}
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />

        {/* tombol kiri */}
        <div className="absolute top-4 left-4 z-20">
          <button
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
            onClick={() => index > 0 && setIndex(index - 1)}
          >
            <FaArrowLeft />
          </button>
        </div>

        {/* tombol kanan */}
        <div className="absolute top-4 right-4 z-20">
          <button
            className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
            onClick={() => index < questions.length - 1 && setIndex(index + 1)}
          >
            <FaArrowRight />
          </button>
        </div>

        {/* isi card */}
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1E3A2E]
                mb-6 drop-shadow-lg bg-white/30 backdrop-blur-sm 
                px-4 py-2 rounded-xl inline-block">
                {questions[index]}
              </h2>

              {/* tombol jawaban */}
              <div className="flex flex-col items-center gap-6 mt-6">
                <button
                  onClick={() => handleAnswer(1)}
                  className="bg-white/80 backdrop-blur-sm w-56 md:w-80 py-4 rounded-[36px] 
                  text-lg font-bold shadow-md text-[#1E3A2E]"
                >
                  YA
                </button>

                <button
                  onClick={() => handleAnswer(0)}
                  className="bg-white/80 backdrop-blur-sm w-56 md:w-80 py-4 rounded-[36px] 
                  text-lg font-bold shadow-md text-[#1E3A2E]"
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
