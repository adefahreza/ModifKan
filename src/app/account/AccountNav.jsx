"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/account", label: "Profil" },
  { href: "/account/orders", label: "Pesanan" },
];

export default function AccountNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Akun" className="mb-6 flex gap-2 overflow-x-auto">
      {ITEMS.map(({ href, label }) => {
        const active = href === "/account" ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold ${active ? "bg-slate-900 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
