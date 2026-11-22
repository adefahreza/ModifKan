"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";
import { toastMessage } from "@/lib/toast-messages";
import { TOAST_EVENT } from "@/lib/toast-client";

const DURATION = 3000; // samakan dengan durasi .toast-progress di globals.css

// Tiga sumber pesan: prop `message` (terkendali), ?toast=<kunci> pada URL (setelah redirect), dan showToast(kunci).
// Wajib dibungkus <Suspense> oleh pemakainya karena memakai useSearchParams.
export default function FlashToast({ message }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // n naik di setiap toast baru, supaya pesan yang sama dua kali berturut-turut tetap mengulang timer.
  const [toast, setToast] = useState({ text: null, n: 0 });
  const [paused, setPaused] = useState(false);
  const remaining = useRef(DURATION);
  const urlKey = searchParams.get("toast");
  const [seenKey, setSeenKey] = useState(null);

  // Menyesuaikan state saat param URL berubah (pola resmi React, tanpa setState di dalam effect).
  if (urlKey !== seenKey) {
    setSeenKey(urlKey);
    const text = toastMessage(urlKey);
    if (text) setToast((t) => ({ text, n: t.n + 1 }));
  }

  // Param dibersihkan dari URL supaya refresh atau tautan yang dibagikan tidak memunculkan toast lagi.
  useEffect(() => {
    if (!toastMessage(urlKey)) return;
    const next = new URLSearchParams(searchParams.toString());
    next.delete("toast");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [urlKey, searchParams, pathname, router]);

  useEffect(() => {
    const onEvent = (e) => {
      const text = toastMessage(e.detail);
      if (text) setToast((t) => ({ text, n: t.n + 1 }));
    };
    window.addEventListener(TOAST_EVENT, onEvent);
    return () => window.removeEventListener(TOAST_EVENT, onEvent);
  }, []);

  // Toast baru: sisa waktu kembali penuh. Effect ini harus di atas effect timer supaya jalan lebih dulu.
  useEffect(() => {
    remaining.current = DURATION;
  }, [toast.n]);

  // Timer hanya berjalan saat tidak di-hover/fokus; sisa waktunya disimpan ketika dijeda.
  useEffect(() => {
    if (!toast.text || paused) return;
    const startedAt = Date.now();
    const timer = setTimeout(() => setToast((t) => ({ ...t, text: null })), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - startedAt));
    };
  }, [toast.text, toast.n, paused]);

  const controlled = message != null;
  const shown = controlled ? message : toast.text;
  const close = () => {
    setPaused(false);
    setToast((t) => ({ ...t, text: null }));
  };

  return (
    <div role="status"
      className="pointer-events-none fixed inset-x-3 top-3 z-[60] sm:inset-x-auto sm:right-4 sm:top-4 sm:w-[22.5rem]">
      {shown ? (
        <div key={controlled ? "controlled" : toast.n}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
          className="toast-in pointer-events-auto relative overflow-hidden rounded-xl bg-slate-900 text-white shadow-2xl shadow-black/50 ring-1 ring-white/20">
          <div className="flex items-start gap-3 py-3 pl-4 pr-1">
            <span aria-hidden="true" className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check size={18} strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1 py-1">
              <p className="font-display text-sm font-bold uppercase italic leading-none tracking-wider text-red-400">Berhasil</p>
              <p className="mt-1 text-sm font-medium text-white">{shown}</p>
            </div>
            {controlled ? null : (
              <button type="button" onClick={close} aria-label="Tutup notifikasi"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>
          {controlled ? null : (
            // Jalur gelap selebar kartu, bar merah di dalamnya menyusut selama DURATION (lihat .toast-progress di globals.css).
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
              <span data-toast-progress data-paused={paused} className="toast-progress block size-full bg-red-500" />
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
