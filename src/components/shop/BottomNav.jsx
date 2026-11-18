"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/products", label: "Kategori", icon: LayoutGrid },
  { href: "/cart", label: "Keranjang", icon: ShoppingCart },
  { href: "/account", label: "Akun", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white lg:hidden">
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold ${active ? "text-red-600" : "text-slate-600"}`}>
            <Icon size={22} aria-hidden="true" />{label}
          </Link>
        );
      })}
    </nav>
  );
}
