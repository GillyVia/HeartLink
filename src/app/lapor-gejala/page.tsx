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

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(25).fill(0));
  const [score, setScore] = useState(0);

  // === Handle Jawaban ===
  const handleAnswer = async (value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
    setScore(score + value);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      await handleSubmit(updated);
    }
  };

  // === Submit ke model Decision Tree ===
  const handleSubmit = async (data: number[]) => {
    const body = {
      age: data[0] ? 55 : 30,
      gender: data[1],
      ap_hi: data[7] ? 150 : 120,
      ap_lo: data[24] ? 95 : 80,
      cholesterol: data[8] ? 2 : 1,
      gluc: data[9] ? 2 : 1,
      smoke: data[3],
      alco: data[4],
      active: data[5] ? 0 : 1,
      height: 165,
      weight: data[10] ? 85 : 65,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      router.push(
        `/hasil-skrining?risk=${result.risk}&prob=${result.probability.toFixed(2)}`
      );
    } catch (err) {
      console.error("❌ Gagal menghubungi server backend:", err);
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  // === Progress bar ===
  const progress = ((index + 1) / questions.length) * 100;

  // === Risiko sementara ===
  let riskLabel = "Rendah";
  if (score >= 10 && score < 18) riskLabel = "Sedang";
  else if (score >= 18) riskLabel = "Tinggi";

  const riskColor =
    riskLabel === "Rendah"
      ? "text-green-700"
      : riskLabel === "Sedang"
      ? "text-yellow-600"
      : "text-red-700";

  return (
    <div className="min-h-screen bg-[#EAF3EF] flex flex-col items-center py-6 px-6 relative">
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
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

      {/* Container utama (diperlebar) */}
      <div className="bg-[#A9CDBB] rounded-[30px] w-full max-w-6xl shadow-lg p-16 md:p-20 text-center relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 rounded-t-[30px]" />
        <motion.div
          className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 to-green-300 rounded-t-[30px]"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />

        {/* Pertanyaan */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-3xl md:text-4xl font-bold text-[#1E3A2E] mb-10">
              {questions[index]}
            </p>

            <div className="flex flex-col items-center gap-8">
              <button
                onClick={() => handleAnswer(1)}
                className="bg-white w-64 md:w-80 py-4 rounded-[50px] text-xl font-bold text-[#1E3A2E] shadow-md hover:bg-gray-100 transition-all"
              >
                YA
              </button>
              <button
                onClick={() => handleAnswer(0)}
                className="bg-white w-64 md:w-80 py-4 rounded-[50px] text-xl font-bold text-[#1E3A2E] shadow-md hover:bg-gray-100 transition-all"
              >
                TIDAK
              </button>
            </div>

            {/* Risiko sementara */}
            <p className="mt-8 text-base text-gray-700 italic">
              Risiko sementara:{" "}
              <span className={`${riskColor} font-semibold`}>
                {riskLabel}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Tombol navigasi kanan */}
        <div className="absolute bottom-8 right-10">
          {index < questions.length - 1 && (
            <div
              onClick={() => setIndex(index + 1)}
              className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
            >
              <FaArrowRight size={18} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
