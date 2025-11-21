"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

   const res = await fetch("http://127.0.0.1:8000/register", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Registrasi berhasil!");
      window.location.href = "/login";
    } else {
      alert("Gagal mendaftar, periksa email atau koneksi server.");
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#A9CDBB]/80 via-[#EAF3EF]/70 to-white/60"></div>

      {/* Left Panel */}
      <div className="relative z-10 w-1/2 flex flex-col justify-center items-center text-center p-10">
        <h1 className="text-5xl font-extrabold text-[#1E3A2E] drop-shadow-md mb-4">
          Hi Welcome!!
        </h1>
        <p className="text-lg text-gray-800 mb-8">
          If you have an account, please login here
        </p>
        <a
          href="/login"
          className="bg-white/90 text-[#1E3A2E] font-semibold py-2 px-8 rounded-full shadow-md hover:shadow-lg hover:bg-[#EAF3EF]/70 transition duration-300"
        >
          Login
        </a>
      </div>

      {/* Right Panel */}
      <div className="relative z-10 w-1/2 flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-md bg-white/80 shadow-2xl p-10 rounded-3xl w-96 border border-white/60"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-[#1E3A2E]">
            Sign Up
          </h2>

          {/* Name fields */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="First name"
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA48C]"
            />
            <input
              type="text"
              placeholder="Last name"
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA48C]"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder="Email address"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA48C]"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6CA48C]"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6DA78C] to-[#90C8A2] text-white py-2 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-5 text-gray-700">
            Already a member?{" "}
            <a
              href="/login"
              className="text-[#1E7FEA] font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
