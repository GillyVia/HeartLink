"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaUser,
  FaPaperPlane,
  FaBars,
  FaSignOutAlt,
  FaHome,
  FaQuestionCircle,
  FaHistory,
} from "react-icons/fa";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const newsContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserName(parsedUser.first_name || "User");
      } catch {
        setUserName("User");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const scrollNews = (direction: "left" | "right") => {
    if (newsContainerRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500;
      newsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const cardWidth = 500;
    const totalCards = 4;
    const interval = setInterval(() => {
      if (newsContainerRef.current) {
        setActiveIndex((prev) => {
          const newIndex = (prev + 1) % totalCards;
          newsContainerRef.current!.scrollTo({
            left: newIndex * cardWidth,
            behavior: "smooth",
          });
          return newIndex;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    if (newsContainerRef.current) {
      const scrollLeft = newsContainerRef.current.scrollLeft;
      const cardWidth = 500;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    }
  };

  return (
    <div
      className="font-playpen min-h-screen bg-cover bg-center flex flex-col items-center relative z-[999]"
    >
      <div className="absolute inset-0 bg-[#ffffff]/80 backdrop-blur-sm"></div>

      <header className="relative w-full z-20">
        <div className="absolute top-0 left-0 w-full h-[220px] bg-[var(--brand-green)] rounded-b-[120px]"></div>

        <div className="relative flex justify-between items-center px-6 py-6">
          <div className="flex items-center gap-3 font-bold text-lg text-[#1E3A2E]">
            <FaBars
              className="text-2xl cursor-pointer hover:scale-110 transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <span>
              Halo, <span className="italic">{userName}</span> 👋
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/80"
          >
            <FaSignOutAlt className="text-xl" />
          </button>
        </div>
      </header>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[var(--sidebar-green)] text-[#1E3A2E] rounded-r-[25px] shadow-md z-30 transform transition-all duration-500 ease-in-out 
        ${sidebarOpen ? "translate-x-0 opacity-100 w-64" : "-translate-x-full opacity-0 w-0"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/30">
          <h2 className="text-xl font-bold">Menu</h2>
          <FaBars
            className="text-2xl cursor-pointer hover:scale-110 transition"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 font-semibold">
          <a href="/dashboard" className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <FaHome /> Beranda
          </a>
          <a href="/profile" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg">
            <FaUser /> Profil
          </a>
          <a href="/faq" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg">
            <FaQuestionCircle /> FAQ
          </a>
          <a href="/riwayat" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg">
            <FaHistory /> Riwayat
          </a>
          <a href="/hubungi-kami" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg">
            <FaPaperPlane /> Hubungi Kami
          </a>
        </nav>
      </aside>

      <div
        onClick={() => router.push("/lapor-gejala")}
        className="relative z-20 bg-white/90 mt-10 rounded-[40px] shadow-lg px-10 py-6 flex flex-col items-center text-center w-[80%] max-w-4xl cursor-pointer hover:scale-[1.02] transition border border-white/50 backdrop-blur-md"
      >
        <img src="/heart.png" alt="heart" className="w-24 h-24 mb-3 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-[#2C423F] hover:text-[#3E6954] transition">
          Lapor Gejala
        </h2>
      </div>

      <div className="relative z-10 mt-10 grid grid-cols-2 sm:grid-cols-4 gap-5 px-4">
        <div
          onClick={() => router.push("/profile")}
          className="flex flex-col items-center justify-center bg-white rounded-[35px] border-4 border-[#315D47] w-36 h-36 cursor-pointer hover:scale-105 transition shadow-sm"
        >
          <FaUser className="text-[#315D47] text-4xl mb-1" />
          <p className="font-bold text-[#1B352B]">Profil</p>
        </div>

        <div
          onClick={() => router.push("/faq")}
          className="flex flex-col items-center justify-center bg-white rounded-[35px] border-4 border-[#315D47] w-36 h-36 cursor-pointer hover:scale-105 transition shadow-sm"
        >
          <FaQuestionCircle className="text-[#315D47] text-4xl mb-1" />
          <p className="font-bold text-[#1B352B]">FAQ</p>
        </div>

        <div
          onClick={() => router.push("/hubungi-kami")}
          className="flex flex-col items-center justify-center bg-white rounded-[35px] border-4 border-[#315D47] w-36 h-36 cursor-pointer hover:scale-105 transition shadow-sm"
        >
          <FaPaperPlane className="text-[#315D47] text-4xl mb-1" />
          <p className="font-bold text-[#1B352B] text-center whitespace-pre-line">
            Hubungi{"\n"}Kami
          </p>
        </div>

        <div
          onClick={() => router.push("/riwayat")}
          className="flex flex-col items-center justify-center bg-white rounded-[35px] border-4 border-[#315D47] w-36 h-36 cursor-pointer hover:scale-105 transition shadow-sm"
        >
          <FaHistory className="text-[#315D47] text-4xl mb-1" />
          <p className="font-bold text-[#1B352B] text-center whitespace-pre-line">
            Riwayat{"\n"}
          </p>
        </div>
      </div>

      {/* ========================= BERITA ============================ */}

      <div className="relative z-10 mt-14 w-[90%] max-w-7xl">
        <h3 className="text-3xl font-extrabold text-[#1E3A2E] mb-6 text-center flex items-center justify-center gap-2">
          Berita Kesehatan Terbaru <span className="text-2xl">🩺</span>
        </h3>

        <button
          onClick={() => scrollNews("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#A0C4A9]/90 text-white p-3 rounded-full shadow-md hover:bg-[#5D7E69] hover:scale-110 transition z-20"
        >
          ‹
        </button>

        <button
          onClick={() => scrollNews("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#A0C4A9]/90 text-white p-3 rounded-full shadow-md hover:bg-[#5D7E69] hover:scale-110 transition z-20"
        >
          ›
        </button>

        <div
          ref={newsContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-6 scrollbar-thin scrollbar-thumb-[#9FC9B4] scrollbar-track-transparent"
        >
          {[
            {
              img: "/news1jkt.jpg",
              title: "Menkes: 600 Ribu Kematian Akibat Penyakit Jantung per Tahun di Indonesia",
              desc: "Menkes mengungkap angka kematian akibat penyakit jantung di Indonesia sangat tinggi, dengan data estimasi yang mencapai ratusan ribu jiwa per tahun—menjadi perhatian serius bagi layanan kesehatan dan puskesmas di seluruh Indonesia.",
              author: "Media Indonesia",
              time: "2 menit lalu",
              url: "https://mediaindonesia.com/humaniora/807494/menkes-ungkap-600-ribu-kematian-akibat-penyakit-jantung-per-tahun-butuh-revolusi-puskesmas",
            },
            {
              img: "/news2jkt.jpg",
              title: "Risiko Sakit Jantung Meningkat Seiring Bertambahnya Usia di Indonesia",
              desc: "Data Regsosek 2023 menunjukkan angka kematian akibat penyakit jantung tetap tinggi di Indonesia. Artikel ini membahas prevalensi dan faktor risiko yang makin signifikan pada berbagai usia.",
              author: "Antara News",
              time: "6 menit lalu",
              url: "https://www.antaranews.com/berita/4634461/risiko-sakit-jantung-meningkat-seiring-wanita-bertambah-usia",
            },
            {
              img: "/news3jkt.jpg",
              title: "Penyakit Jantung Ancaman Serius yang Membutuhkan Kesadaran dan Inovasi",
              desc: "Bahasan tentang penyakit jantung sebagai ancaman serius di Indonesia, faktor risikonya, dan tantangan akses layanan kesehatan kardiovaskular.",
              author: "Media Indonesia",
              time: "11 menit lalu",
              url: "https://mediaindonesia.com/humaniora/733576/penyakit-jantung-ancaman-serius-yang-membutuhkan-kesadaran-dan-inovasi",
            },
            {
              img: "/news4.jpg",
              title: "Berita Penyakit Jantung Terkini & Fakta Risiko di Indonesia (Tag DetikHealth)",
              desc: "Halaman berisi ringkasan berita terbaru tentang penyakit jantung di Indonesia, termasuk riset, pencegahan, dan hubungan gaya hidup dengan kesehatan jantung.",
              author: "Detik Health (Tematis)",
              time: "20 menit lalu",
              url: "https://www.detik.com/tag/penyakit-jantung/"
            },
          ].map((news, index) => (
            <a
             key={index}
             href={news.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block flex-shrink-0"
    >
            <div
              className="flex-shrink-0 w-[480px] bg-white/85 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden backdrop-blur-sm transition hover:scale-[1.02] cursor-pointer border border-white/50"
            >
              <img
                src={news.img}
                alt={news.title}
                className="w-full h-56 object-cover"
              />

              <div className="p-5 flex flex-col justify-between h-[230px]">
                <div>
                  <h4 className="font-bold text-[#1E3A2E] text-lg mb-2 hover:text-[#3E6954] transition">
                    {news.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-snug">
                    {news.desc}
                  </p>
                </div>

                <p className="text-xs text-[#6CA48C] mt-3 italic">
                  {news.time} • {news.author}
                </p>
              </div>
            </div>
            </a>
          ))}
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition ${
                activeIndex === i ? "bg-[#4C8C6C]" : "bg-[#CFE5DB]"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
