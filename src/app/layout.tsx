import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Playpen_Sans } from "next/font/google";
import "./globals.css";

// ===== FONT UTAMA (Playpen Sans) =====
const playpen = Playpen_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playpen",
});

// ===== FONT MONO (optional, untuk code) =====
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "HeartLink",
  description: "Sistem Deteksi Dini Gejala Penyakit Jantung",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`
          ${playpen.variable}
          ${geistMono.variable}
          font-sans
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
