"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaUser,
  FaQuestionCircle,
  FaHistory,
  FaPaperPlane,
  FaBars,
} from "react-icons/fa";

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/faq");
        if (!res.ok) {
          console.error("FAQ fetch failed:", res.status);
          setFaqData([]);
          return;
        }
        const data = await res.json();
        setFaqData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setFaqData([]);
      }
    };

    void fetchFaq();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex app-bg font-sans overflow-hidden relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-[#A0C4A9] text-[#1E3A2E] rounded-r-[25px] shadow-md z-20 transform transition-all duration-500 ease-in-out 
        ${sidebarOpen ? "translate-x-0 opacity-100 w-64" : "-translate-x-full opacity-0 w-0"}`}
      >
        <div className="flex items-center justify-center px-4 py-4 border-b border-white/30">
          <h2 className="text-xl font-bold">Menu</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 font-semibold">
          <a
            href="/dashboard"
            className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition"
          >
            <FaHome /> Beranda
          </a>

          {/* FIX: route profil */}
          <a
            href="/profile"
            className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition"
          >
            <FaUser /> Profil
          </a>

          <a
            href="/faq"
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <FaQuestionCircle /> FAQ
          </a>

          <a
            href="/riwayat"
            className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition"
          >
            <FaHistory /> Riwayat
          </a>

          <a
            href="/hubungi-kami"
            className="flex items-center gap-3 hover:bg-[#CFE5DB] px-4 py-2 rounded-lg transition"
          >
            <FaPaperPlane /> Hubungi Kami
          </a>
        </nav>
      </aside>

      <main
        className={`flex-1 p-8 transition-all duration-500 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <FaBars
          className="text-3xl text-[#1E3A2E] cursor-pointer mb-6"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="mb-6 rounded-2xl overflow-hidden relative shadow-lg">
          <Image
            src="/FAQ.JPG"
            alt="FAQ Header"
            width={1200}
            height={300}
            className="object-cover w-full h-[220px]"
          />
          <div className="absolute inset-0 bg-white/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl font-extrabold text-gray-900">
              Frequently Asked Questions
            </h1>
            <p className="text-2xl font-extrabold text-gray-900">
              General Information and Answers Regarding the Heart Detection System
            </p>
          </div>
        </div>

        <div className="space-y-5 mt-6">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="rounded-2xl overflow-hidden bg-[#d2d3d5]">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left text-lg font-semibold text-black"
                >
                  <span>{faq.question}</span>
                  <span className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                </button>

                <div className="h-[2px] bg-gray-700 mx-4" />

                {isOpen && (
                  <div className="px-6 py-4 text-gray-900 bg-[#d2d3d5] text-lg font-semibold leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
