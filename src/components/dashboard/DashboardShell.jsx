"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgeCheck, ClipboardList, LayoutDashboard, LogOut, Menu, Package, Store, Tags, UserCog, Users, X,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import Logo from "@/components/Logo";
import FlashToast from "@/components/ui/FlashToast";

const ICONS = { LayoutDashboard, Store, Package, ClipboardList, BadgeCheck, Users, Tags, UserCog };

function Sidebar({ title, items, user, pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="px-5 py-5">
        <Logo size="md" />
        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      </div>
      <nav aria-label={title} className="flex-1 space-y-1 px-3">
        {items.map(({ href, label, icon, badge }) => {
          const Icon = ICONS[icon] ?? LayoutDashboard;
          const root = href === "/seller" || href === "/admin";
          const active = root ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors ${active ? "bg-red-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
              <Icon size={18} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {badge ? <span className={`rounded-full px-2 text-xs ${active ? "bg-white text-red-600" : "bg-red-600 text-white"}`}>{badge}</span> : null}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <p className="truncate px-3 pb-2 text-xs text-slate-400">{user.name}</p>
        <form action={logoutAction}>
          <button type="submit" className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
            <LogOut size={18} aria-hidden="true" /> Keluar
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DashboardShell({ title, items, user, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="fixed inset-y-0 w-56"><Sidebar title={title} items={items} user={user} pathname={pathname} /></div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 bg-slate-900 px-4 py-2 lg:hidden">
        <button type="button" aria-label="Buka menu" aria-expanded={open} onClick={() => setOpen(true)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          <Menu size={22} />
        </button>
        <Logo size="sm" />
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</span>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60" onClick={() => setOpen(false)} />
          <div className="relative h-full w-64 max-w-[80%] shadow-xl">
            <button type="button" aria-label="Tutup menu" onClick={() => setOpen(false)}
              className="absolute right-2 top-3 z-10 inline-flex size-9 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800">
              <X size={18} />
            </button>
            <Sidebar title={title} items={items} user={user} pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="min-w-0 flex-1 bg-slate-50 p-4 sm:p-6">{children}</main>
      <Suspense fallback={null}><FlashToast /></Suspense>
    </div>
  );
}
