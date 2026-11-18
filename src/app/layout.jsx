import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "ModifKan — Marketplace Part & Modifikasi Mobil",
  description: "Marketplace multi-toko sparepart & part modifikasi mobil",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} ${barlow.variable}`}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">{children}</body>
    </html>
  );
}
