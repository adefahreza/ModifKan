import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <Logo size="sm" />
        <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/products" className="hover:text-white">Semua produk</Link>
          <Link href="/register" className="hover:text-white">Buka toko</Link>
        </nav>
        <p className="text-xs">© 2026 ModifKan. Marketplace part &amp; modifikasi mobil.</p>
      </div>
    </footer>
  );
}
