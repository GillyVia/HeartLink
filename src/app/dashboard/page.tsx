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

  // ✅ Tutup sidebar jika klik di luar area
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // ✅ Ambil nama user dari localStorage
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

  // ✅ Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  // ✅ Scroll manual berita
  const scrollNews = (direction: "left" | "right") => {
    if (newsContainerRef.current) {
      const scrollAmount = direction === "left" ? -500 : 500;
      newsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // ✅ Auto-slide berita ke kanan setiap 5 detik
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

  // ✅ Update indikator titik saat scroll manual
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
      className="min-h-screen bg-cover bg-center flex flex-col items-center font-sans relative"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#EAF3EF]/80 backdrop-blur-sm"></div>

      {/* ===== HEADER ===== */}
      <header className="relative z-20 bg-[#A0C4A9]/90 w-full flex justify-between items-center px-6 py-4 rounded-b-[60px] shadow-md backdrop-blur-md">
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
          className="bg-[#5D7E69] text-white p-2 rounded-full hover:bg-[#4b6654] transition duration-300 shadow-md"
        >
          <FaSignOutAlt className="text-xl" />
        </button>
      </header>

      {/* ===== SIDEBAR ===== */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#A0C4A9] text-[#1E3A2E] rounded-r-[25px] shadow-md z-30 transform transition-all duration-500 ease-in-out 
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
          <a href="/profile" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaUser /> Profil
          </a>
          <a href="/faq" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaQuestionCircle /> FAQ
          </a>
          <a href="/riwayat" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaHistory /> Riwayat
          </a>
          <a href="/hubungi-kami" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
            <FaPaperPlane /> Hubungi Kami
          </a>
        </nav>
      </aside>

      {/* ===== LAPOR GEJALA ===== */}
      <div
        onClick={() => router.push("/lapor-gejala")}
        className="relative z-10 bg-white/90 mt-10 rounded-[40px] shadow-lg px-10 py-6 flex flex-col items-center text-center w-[80%] max-w-4xl cursor-pointer hover:scale-[1.02] transition-transform duration-300 border border-white/50 backdrop-blur-md"
      >
        <img src="/heart.png" alt="heart" className="w-24 h-24 mb-3 animate-pulse" />
        <h2 className="text-2xl font-extrabold text-[#2C423F] hover:text-[#3E6954] transition">
          Lapor Gejala
        </h2>
      </div>

      {/* ===== FITUR GRID ===== */}
      <div className="relative z-10 mt-10 grid grid-cols-2 sm:grid-cols-4 gap-8 justify-center">
        {[
          { icon: <FaUser />, label: "Profile", route: "/profile" },
          { icon: <FaQuestionCircle />, label: "FAQ", route: "/faq" },
          { icon: <FaHistory />, label: "Riwayat", route: "/riwayat" },
          { icon: <FaPaperPlane />, label: "Hubungi Kami", route: "/hubungi-kami" },
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => router.push(item.route)}
            className="flex flex-col items-center bg-white/80 border-2 border-[#315D47]/40 rounded-[25px] p-6 shadow-md hover:bg-[#CFE5DB]/70 hover:shadow-lg transition duration-300 cursor-pointer backdrop-blur-sm"
          >
            <div className="text-[#315D47] text-4xl mb-3">{item.icon}</div>
            <p className="font-bold text-[#1B352B] text-center whitespace-pre-line">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* ===== BERITA ===== */}
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
              img: "/news1.jpg",
              title: "Pola Makan Sehat untuk Jantung Kuat 💚",
              desc: "Menjaga kesehatan jantung dimulai dari pola makan seimbang.",
              author: "Dokter Kardiologi Nasional",
              time: "2 jam yang lalu",
            },
            {
              img: "/news2.jpg",
              title: "Pentingnya Olahraga Teratur 🏃‍♂️",
              desc: "Aktivitas ringan seperti jalan kaki 30 menit sehari menurunkan risiko penyakit jantung.",
              author: "Komunitas Jantung Sehat",
              time: "1 hari yang lalu",
            },
            {
              img: "/news3.jpg",
              title: "Kenali Gejala Dini Serangan Jantung 🚨",
              desc: "Nyeri dada, lelah berlebihan, dan sesak napas bisa jadi tanda awal.",
              author: "RS Pusat Jantung Jakarta",
              time: "3 hari yang lalu",
            },
            {
              img: "/news4.jpg",
              title: "Dampak Stres terhadap Kesehatan Jantung 😥",
              desc: "Tekanan emosional berlebih memicu detak jantung dan tekanan darah.",
              author: "Psikolog Kesehatan Nasional",
              time: "5 hari yang lalu",
            },
          ].map((news, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[480px] bg-white/85 rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden backdrop-blur-sm transition-transform hover:scale-[1.02] cursor-pointer border border-white/50"
            >
              <img src={news.img} alt={news.title} className="w-full h-56 object-cover" />
              <div className="p-5 flex flex-col justify-between h-[230px]">
                <div>
                  <h4 className="font-bold text-[#1E3A2E] text-lg mb-2 hover:text-[#3E6954] transition">
                    {news.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-snug">{news.desc}</p>
                </div>
                <p className="text-xs text-[#6CA48C] mt-3 italic">
                  {news.time} • {news.author}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Indikator Titik */}
        <div className="flex justify-center mt-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === i ? "bg-[#4C8C6C]" : "bg-[#CFE5DB]"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
