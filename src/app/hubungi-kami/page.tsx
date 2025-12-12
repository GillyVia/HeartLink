"use client";
import { FaMapMarkerAlt, FaWhatsapp, FaEnvelope } from "react-icons/fa";

export default function HubungiKami() {
  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-10 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/HubungiKami.jpeg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center text-white mb-8">
        <h1 className="text-4xl font-extrabold drop-shadow-lg">Hubungi Kami</h1>
        <p className="text-lg mt-2 drop-shadow-md">
          Jika ada yang ingin ditanya & mau dibantu
        </p>
      </div>

      {/* CARD UTAMA */}
      <div
        className="relative z-10 w-full max-w-3xl bg-[#7FAF96] bg-opacity-95
        rounded-[50px] p-8 flex flex-col items-center shadow-2xl"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-black mb-6">Get in touch</h2>

        {/* INNER CARD */}
        <div
          className="bg-[#C9E3D4] w-[95%] rounded-[35px] p-8 flex flex-col gap-8
          shadow-md"
        >
          {/* Address */}
          <div className="flex items-start gap-5">
            <div className="text-3xl text-black">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="font-bold text-lg text-black">Address</p>
              <p className="text-sm text-black leading-tight">
                Jl. Ahmad Yani, Tlk. Tering, Kota Batam, Kepulauan Riau
              </p>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="flex items-start gap-5">
            <div className="text-3xl text-black">
              <FaWhatsapp />
            </div>
            <div>
              <p className="font-bold text-lg text-black">WhatsApp</p>
              <p className="text-sm text-black leading-tight">
                +62-822-8782-5959
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-5">
            <div className="text-3xl text-black">
              <FaEnvelope />
            </div>
            <div>
              <p className="font-bold text-lg text-black">Email</p>
              <p className="text-sm text-black leading-tight">
                heartlink4@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
