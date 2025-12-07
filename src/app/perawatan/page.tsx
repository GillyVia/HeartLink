"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Perawatan() {
  const params = useSearchParams();
  const router = useRouter();
  const risk = params.get("risk") || "Tidak diketahui";

  const getColor = (risk: string) => {
    switch (risk) {
      case "Tinggi":
        return "bg-yellow-400 text-black";
      case "Sedang":
        return "bg-yellow-200 text-black";
      case "Rendah":
        return "bg-green-300 text-black";
      default:
        return "bg-gray-200 text-black";
    }
  };

  // === Rekomendasi berbeda sesuai risiko ===
  const getRecommendation = (risk: string) => {
    switch (risk) {
      case "Rendah":
        return {
          title: "Risiko Rendah",
          advice: [
            "Pertahankan gaya hidup sehat dengan rutin berolahraga minimal 150 menit per minggu (jalan kaki, bersepeda, yoga).",
            "Konsumsi makanan seimbang: tinggi serat, rendah lemak jenuh, dan perbanyak sayur serta buah.",
            "Hindari stres berkepanjangan dan cukup tidur (7–8 jam).",
            "Lakukan pemeriksaan kesehatan (tekanan darah, kolesterol, gula darah) minimal 1 kali per tahun.",
          ],
          note: "Anda berada dalam kategori risiko rendah. Teruskan gaya hidup sehat dan tetap pantau kondisi jantung Anda.",
        };

      case "Sedang":
        return {
          title: "Risiko Sedang",
          advice: [
            "Kurangi konsumsi makanan tinggi garam, lemak, dan gula. Batasi daging merah dan makanan olahan.",
            "Lakukan aktivitas fisik sedang (30 menit/hari, 5 kali/minggu).",
            "Mulai pantau tekanan darah dan kadar kolesterol secara berkala.",
            "Hindari merokok dan batasi konsumsi alkohol.",
            "Kelola stres dengan relaksasi, meditasi, atau kegiatan yang menyenangkan.",
          ],
          note: "Risiko sedang menunjukkan perlunya pemantauan rutin. Disarankan konsultasi dengan tenaga medis untuk pemeriksaan lanjut.",
        };

      case "Tinggi":
        return {
          title: "Risiko Tinggi",
          advice: [
            "Segera konsultasikan dengan dokter spesialis jantung untuk pemeriksaan lebih lanjut (EKG, echocardiogram, atau tes laboratorium).",
            "Hentikan merokok dan hindari alkohol sepenuhnya.",
            "Atur pola makan: rendah garam, tinggi serat, dan batasi makanan olahan.",
            "Jaga berat badan ideal dengan diet sehat dan olahraga ringan (jalan kaki 20–30 menit).",
            "Pantau tekanan darah dan gula darah setiap minggu.",
            "Jika memiliki gejala seperti nyeri dada, sesak napas, atau jantung berdebar, segera ke fasilitas kesehatan.",
          ],
          note: "Anda berada pada kategori risiko tinggi. Penanganan cepat dan perubahan gaya hidup sangat penting untuk mencegah komplikasi penyakit jantung.",
        };

      default:
        return {
          title: "Data Tidak Ditemukan",
          advice: [
            "Harap lakukan skrining ulang untuk mendapatkan hasil akurat.",
          ],
          note: "",
        };
    }
  };

  const rec = getRecommendation(risk);

  return (
    <div className="min-h-screen bg-[#EAF3EF] flex flex-col items-center py-10 px-6">
      <motion.div
        className="max-w-6xl w-full bg-gradient-to-br from-[#EAF3EF] to-[#CDE2D8] rounded-[30px] shadow-lg p-10 md:p-16 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-[#1E3A2E] mb-4">
          Perawatan & Pencegahan
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Berdasarkan hasil analisis risiko Anda, berikut langkah perawatan dan
          pencegahan yang disarankan untuk menjaga kesehatan jantung secara
          optimal.
        </p>

        {/* Ringkasan Risiko */}
        <div className="flex flex-wrap items-center gap-4 mb-10">
          <div className="border border-[#1E3A2E] rounded-full px-6 py-3 flex items-center gap-4">
            <span className="font-semibold">Ringkasan Hasil Risiko</span>
            <span
              className={`px-4 py-1 rounded-full font-bold ${getColor(risk)}`}
            >
              {risk}
            </span>
          </div>
          <button
            onClick={() => router.push(`/hasil-skrining?risk=${risk}`)}
            className="border border-[#1E3A2E] rounded-full px-6 py-3 font-semibold hover:bg-white transition-all"
          >
            Lihat Detail Risiko
          </button>
        </div>

        {/* Rekomendasi */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-extrabold text-[#1E3A2E] mb-6">
              {rec.title}
            </h2>

            {rec.advice.map((tip, idx) => (
              <p key={idx} className="text-gray-800 mb-4 leading-relaxed">
                {idx + 1}. {tip}
              </p>
            ))}

            <p className="mt-6 italic text-gray-700">{rec.note}</p>

            <div className="mt-10">
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-[#1E3A2E] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2A4C3A] transition-all"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>

          {/* Ilustrasi Dokter */}
          <div className="flex justify-center items-center">
            <Image
              src="/doctor-illustration.png"
              alt="Ilustrasi Dokter"
              width={400}
              height={400}
              className="drop-shadow-lg"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
