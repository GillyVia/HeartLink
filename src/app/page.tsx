"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const news = [
    {
      img: "/news1.jpg",
      title: "Waspada Gejala Dini Penyakit Jantung",
    },
    {
      img: "/news2.jpg",
      title: "Manfaat Olahraga Ringan untuk Kesehatan Jantung",
    },
    {
      img: "/news3.jpg",
      title: "Pola Makan Sehat untuk Cegah Penyakit Jantung",
    },
    {
      img: "/news4.jpg",
      title: "Kenali Tekanan Darah Normal Anda",
    },
  ];

  return (
    <div className="relative min-h-screen w-full font-playpen bg-[#F4F7F5] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/GambarLanding.jpg')",
          filter: "blur(2px)",
        }}
      ></div>

      {/* Overlay hijau */}
      <div className="absolute inset-0 bg-[#315D47]/40"></div>

      {/* Konten */}
      <div className="relative z-10 flex flex-col items-center pt-10 px-6">
        {/* Logo */}
        <div className="flex items-center gap-3 w-full max-w-6xl">
          <img
            src="/logo.png"
            className="w-16 h-16"
            alt="HeartLink Logo"
          />

          <div>
            <h1 className="text-2xl font-extrabold text-[#000000]">
              HeartLink
            </h1>
            <p className="text-sm text-[#000000]">
              Perawatan Cerdas untuk Jantung yang Lebih Sehat
            </p>
          </div>
        </div>

        {/* Judul */}
        <div className="flex justify-end w-full max-w-6xl mt-20">
          <div className="text-right max-w-lg">
            <h2 className="text-4xl font-extrabold text-[#000000] leading-tight">
              Connecting You <br /> to a Healthier <br /> Heart
            </h2>

            <p className="mt-4 text-[#000000] text-sm leading-relaxed">
              HeartLink helps you detect early signs of heart disease through
              smart decision support and continuous health monitoring. Stay
              informed, take action, and protect your heart with smarter
              technology.
            </p>

            {/* Tombol Login */}
            <button
              onClick={() => router.push("/login")}
              className="mt-6 bg-[#3b6049] text-white px-8 py-2 rounded-lg text-lg font-semibold shadow-md 
                         hover:bg-[#2e4f3d] transition"
            >
              Login
            </button>

            {/* Link Register */}
            <p className="mt-3 text-sm text-[#000000]">
              Belum punya akun?{" "}
              <span
                onClick={() => router.push("/register")}
                className="font-semibold text-[#3b6049] cursor-pointer hover:underline"
              >
                Daftar
              </span>
            </p>
          </div>
        </div>

        {/* Lengkungan putih */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-[120px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,192L1440,64L1440,320L0,320Z"
            ></path>
          </svg>
        </div>

        {/* BERITA */}
        <div className="relative z-10 mt-[60px] pb-20 w-full flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-6xl px-6">
            {news.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl overflow-hidden 
                           hover:scale-105 transition cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <p className="p-3 text-sm text-center font-semibold text-[#000000]">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

