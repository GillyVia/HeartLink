"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      alert(`Selamat datang, ${data.first_name}!`);
      router.push("/dashboard");
    } else {
      alert("Email atau password salah.");
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex"
      style={{
        backgroundImage: "url('/background.jpg')", // gunakan background hijau lembut
      }}
    >
      {/* Overlay gradient transparan */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#A9CDBB]/85 via-[#EAF3EF]/70 to-white/60"></div>

      {/* PANEL KIRI (Form Login) */}
      <div className="relative z-10 w-1/2 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/85 shadow-2xl p-10 rounded-3xl w-96 border border-white/60 animate-fadeIn"
        >
          {/* Logo jantung */}
          <div className="flex justify-center mb-6">
            <img
              src="/heart.png"
              alt="heart logo"
              className="w-28 h-28 animate-pulse drop-shadow-md"
            />
          </div>

          {/* Judul */}
          <h2 className="text-3xl font-extrabold mb-8 text-center text-[#1E3A2E] tracking-wide">
            Login
          </h2>

          {/* Input Email */}
          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA48C] shadow-sm"
          />

          {/* Input Password */}
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA48C] shadow-sm"
          />

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6DA78C] to-[#90C8A2] text-white py-2 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Login
          </button>

          {/* Forgot Password */}
          <p className="text-sm text-center mt-4 text-gray-700 hover:text-[#1E3A2E] transition">
            Forgot Password?
          </p>
        </form>
      </div>

      {/* PANEL KANAN */}
      <div className="relative z-10 w-1/2 flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-5xl font-extrabold text-[#1E3A2E] drop-shadow-md mb-4 animate-fadeIn">
          Start Your Journey Now
        </h1>
        <p className="text-lg text-gray-800 mb-8 max-w-md">
          If you don’t have an account yet, join us and start your journey
          toward better heart health 💚
        </p>
        <a
          href="/register"
          className="bg-white/90 text-[#1E3A2E] font-semibold py-2 px-8 rounded-full shadow-md hover:shadow-lg hover:bg-[#EAF3EF]/70 transition duration-300"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}
