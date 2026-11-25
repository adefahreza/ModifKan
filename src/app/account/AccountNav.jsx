"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/account", label: "Profil" },
  { href: "/account/orders", label: "Pesanan" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Alamat" },
];

// Tab di bagian atas kotak akun; tab aktif bergaris bawah merah.
export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Akun" className="flex gap-6 overflow-x-auto border-b border-slate-200 px-5 sm:px-6">
      {ITEMS.map(({ href, label }) => {
        const active = href === "/account" ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`-mb-px inline-flex min-h-12 shrink-0 items-center border-b-[3px] text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 ${active ? "border-red-600 text-red-600" : "border-transparent text-slate-500 hover:text-slate-900"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
