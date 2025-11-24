import React from "react";
import { FaMapMarkerAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function HubungiKami() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl font-bold text-white mb-2 mt-12 text-center font-playpen">
          Hubungi Kami
        </h1>
        <p className="text-lg text-white mb-8 text-center font-playpen">
          Jika ada yang ingin ditanya & mau dibantu
        </p>
        <div className="bg-[#8eb69b] rounded-[40px] px-8 py-6 w-full max-w-xl shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center mb-6 font-playpen">Get in touch</h2>
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <FaMapMarkerAlt className="text-2xl text-[#2d4739]" />
              <div>
                <span className="font-bold text-lg text-[#2d4739] font-playpen">Address</span>
                <div className="text-[#2d4739] font-playpen text-base">Jl. Ahmad Yani, Tlk. Tering, Kota Batam, Kepulauan Riau</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaWhatsapp className="text-2xl text-[#2d4739]" />
              <div>
                <span className="font-bold text-lg text-[#2d4739] font-playpen">WhatsApp</span>
                <div className="text-[#2d4739] font-playpen text-base">+62-822-8782-5959</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-2xl text-[#2d4739]" />
              <div>
                <span className="font-bold text-lg text-[#2d4739] font-playpen">Email</span>
                <div className="text-[#2d4739] font-playpen text-base">heartlink4@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
