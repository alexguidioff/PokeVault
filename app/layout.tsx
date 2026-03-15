import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
// 1. Aggiungi questo import:
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokéGrid - The Ultimate ROM Hack Database",
  description: "Discover and track your favorite Pokémon ROM hacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}

        {/* 2. AGGIUNGI QUESTI SCRIPT QUI: Il motore di RomPatcher */}
        <Script src="https://cdn.jsdelivr.net/gh/marcrobledo/RomPatcher.js@master/js/MarcFile.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/gh/marcrobledo/RomPatcher.js@master/js/crc.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/gh/marcrobledo/RomPatcher.js@master/js/formats/ips.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/gh/marcrobledo/RomPatcher.js@master/js/formats/ups.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/gh/marcrobledo/RomPatcher.js@master/js/formats/bps.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}