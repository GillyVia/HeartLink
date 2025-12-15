"use client";
import {
  FaMapMarkerAlt,
  FaWhatsapp,
  FaEnvelope,
  FaBars,
  FaHome,
  FaUser,
  FaQuestionCircle,
  FaHistory,
  FaPaperPlane,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function HubungiKami() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Tutup sidebar jika klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-4 py-10 bg-cover bg-center relative font-sans"
      style={{ backgroundImage: "url('/HubungiKami.jpeg')" }}
    >
      {/* Overlay klik luar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
  ref={sidebarRef}
  className={`fixed top-0 left-0 h-full bg-[#A0C4A9] text-[#1E3A2E] rounded-r-[25px] shadow-md z-20 transform transition-all duration-500 ease-in-out 
  ${sidebarOpen ? "translate-x-0 opacity-100 w-64" : "-translate-x-full opacity-0 w-0"}`}
>
  <div className="flex items-center justify-center px-4 py-4 border-b border-white/30">
    <h2 className="text-xl font-bold">Menu</h2>
  </div>


        <nav className="flex-1 px-4 py-6 space-y-3 font-semibold">
          <a href="/dashboard" className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition">
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
          <a href="/hubungi-kami" className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
            <FaPaperPlane /> Hubungi Kami
          </a>
        </nav>
      </aside>

      {/* HEADER */}
      <div className="absolute top-6 left-6 z-20">
        <FaBars
          className="text-3xl text-white cursor-pointer hover:scale-110 transition drop-shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Overlay utama */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center text-white mb-8 mt-8">
        <h1 className="text-4xl font-extrabold drop-shadow-lg">Hubungi Kami</h1>
        <p className="text-lg mt-2 drop-shadow-md">
          Jika ada yang ingin ditanya & mau dibantu
        </p>
      </div>

      {/* CARD UTAMA */}
      <div className="relative z-10 w-full max-w-3xl bg-[#7FAF96] bg-opacity-95 rounded-[50px] p-8 flex flex-col items-center shadow-2xl">
        <h2 className="text-2xl font-bold text-black mb-6">Get in touch</h2>

        <div className="bg-[#C9E3D4] w-[95%] rounded-[35px] p-8 flex flex-col gap-8 shadow-md">
          <div className="flex items-start gap-5">
            <FaMapMarkerAlt className="text-3xl text-black" />
            <div>
              <p className="font-bold text-lg text-black">Address</p>
              <p className="text-sm text-black leading-tight">
                Jl. Ahmad Yani, Tlk. Tering, Kota Batam, Kepulauan Riau
              </p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <FaWhatsapp className="text-3xl text-black" />
            <div>
              <p className="font-bold text-lg text-black">WhatsApp</p>
              <p className="text-sm text-black leading-tight">+62-822-8782-5959</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <FaEnvelope className="text-3xl text-black" />
            <div>
              <p className="font-bold text-lg text-black">Email</p>
              <p className="text-sm text-black leading-tight">heartlink4@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
