"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";

function initials(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts.at(-1)[0] : "")).toUpperCase() || "?";
}

const itemClass = "flex min-h-11 w-full items-center gap-3 px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500";

// Menu profil Buyer di navbar: terbuka saat hover (mouse), klik/tap, atau keyboard. Esc dan klik di luar menutupnya.
export default function UserMenu({ name, email }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const closeTimer = useRef(null);
  const openedBy = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => { if (!rootRef.current?.contains(e.target)) close(); };
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      close();
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // openedBy disimpan di ref (bukan state) supaya klik yang datang tepat setelah hover membaca nilai terbaru.
  function close() {
    openedBy.current = null;
    setOpen(false);
  }

  function onPointerEnter(e) {
    if (e.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (!openedBy.current) openedBy.current = "hover";
    setOpen(true);
  }

  function onPointerLeave(e) {
    if (e.pointerType !== "mouse" || openedBy.current !== "hover") return;
    closeTimer.current = setTimeout(close, 200);
  }

  // Klik saat menu terbuka karena hover: menu dikunci tetap terbuka. Selain itu, klik membuka/menutup.
  function onClick() {
    if (openedBy.current === "hover") {
      openedBy.current = "click";
      setOpen(true);
    } else if (openedBy.current === "click") {
      close();
    } else {
      openedBy.current = "click";
      setOpen(true);
    }
  }

  const firstName = String(name ?? "").split(" ")[0];
  return (
    <div ref={rootRef} className="relative" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <button ref={buttonRef} type="button" onClick={onClick} aria-expanded={open} aria-controls={panelId}
        className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 lg:px-3 ${open ? "bg-slate-800" : ""}`}>
        <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">{initials(name)}</span>
        <span className="hidden lg:inline">{firstName}</span>
        <span className="sr-only">Menu akun</span>
        <ChevronDown size={16} aria-hidden="true" className={`hidden transition-transform lg:block ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div id={panelId} className="absolute right-0 top-full z-50 w-60 pt-2">
          <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
              <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
              <p className="truncate text-xs text-slate-500">{email}</p>
            </div>
            <Link href="/account" onClick={close} className={`${itemClass} text-slate-700 hover:bg-slate-100`}>
              <User size={18} aria-hidden="true" /> Akun saya
            </Link>
            <form action={logoutAction} className="border-t border-slate-200">
              <button type="submit" className={`${itemClass} text-red-600 hover:bg-red-50`}>
                <LogOut size={18} aria-hidden="true" /> Keluar
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
