"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function HasilSkrining() {
  const router = useRouter();
  const params = useSearchParams();
  const risk = params.get("risk") || "Tidak diketahui";
  const prob = parseFloat(params.get("prob") || "0").toFixed(2);

  // Data untuk diagram
  const COLORS = ["#A5D6A7", "#FFF176", "#EF9A9A"];
  const data = [
    { name: "Rendah", value: risk === "Rendah" ? 60 : 15 },
    { name: "Sedang", value: risk === "Sedang" ? 60 : 25 },
    { name: "Tinggi", value: risk === "Tinggi" ? 60 : 50 },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Rendah":
        return "text-green-700";
      case "Sedang":
        return "text-yellow-700";
      case "Tinggi":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF3EF] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="bg-white rounded-[30px] shadow-xl w-full max-w-5xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="bg-[#A9CDBB] py-6 text-center rounded-t-[30px]">
          <h1 className="text-4xl font-extrabold text-[#1E3A2E]">
            Hasil Skrining
          </h1>
        </div>

        {/* Body */}
        <div className="p-10 flex flex-col items-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(1)}%`}

              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <p className="text-lg mt-6 text-gray-700">
            Estimasi Risiko Berdasarkan Model:{" "}
            <span className="font-semibold">{prob}</span>
          </p>
          <p className={`text-2xl font-bold mt-2 ${getRiskColor(risk)}`}>
            Risiko Anda: {risk}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-[#1E3A2E] text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-[#2A4C3A]"
            >
              Kembali ke Dashboard
            </button>
            <button
              onClick={() => router.push(`/perawatan?risk=${risk}`)}
              className="border border-[#1E3A2E] text-[#1E3A2E] px-8 py-3 rounded-full font-semibold hover:bg-gray-100"
            >
              Lanjut ke Perawatan
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
