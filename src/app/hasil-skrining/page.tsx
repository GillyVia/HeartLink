"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function HasilSkrining() {
  const router = useRouter();
  const params = useSearchParams();
  const risk = params.get("risk");

  const bg =
    risk === "Rendah"
      ? "bg-green-100"
      : risk === "Sedang"
      ? "bg-yellow-100"
      : "bg-red-100";

  const message =
    risk === "Rendah"
      ? "Risiko Anda rendah. Pertahankan gaya hidup sehat 💚"
      : risk === "Sedang"
      ? "Risiko Anda sedang. Mulai perhatikan pola makan dan olahraga 🧘‍♀️"
      : "Risiko Anda tinggi! Segera konsultasi ke dokter jantung 💊";

  return (
    <div className={`min-h-screen flex justify-center items-center ${bg}`}>
      <div className="bg-white rounded-[30px] shadow-lg p-10 w-[90%] max-w-lg text-center">
        <h1 className="text-3xl font-bold text-[#1E3A2E] mb-6">
          Hasil Skrining Risiko Jantung
        </h1>
        <p className="text-xl font-semibold mb-4">
          Tingkat Risiko:{" "}
          <span
            className={
              risk === "Rendah"
                ? "text-green-700"
                : risk === "Sedang"
                ? "text-yellow-700"
                : "text-red-700"
            }
          >
            {risk}
          </span>
        </p>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-[#92BBAE] text-white px-6 py-2 rounded-full hover:bg-green-700"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}
