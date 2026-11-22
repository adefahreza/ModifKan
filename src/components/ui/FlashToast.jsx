"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toastMessage } from "@/lib/toast-messages";
import { TOAST_EVENT } from "@/lib/toast-client";

const DURATION = 3000;

// Tiga sumber pesan: prop `message` (terkendali), ?toast=<kunci> pada URL (setelah redirect), dan showToast(kunci).
// Wajib dibungkus <Suspense> oleh pemakainya karena memakai useSearchParams.
export default function FlashToast({ message }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // n naik di setiap toast baru, supaya pesan yang sama dua kali berturut-turut tetap mengulang timer.
  const [toast, setToast] = useState({ text: null, n: 0 });
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

  useEffect(() => {
    if (!toast.text) return;
    const timer = setTimeout(() => setToast((t) => ({ ...t, text: null })), DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  const shown = message ?? toast.text;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 lg:bottom-6">
      <div role="status" className={shown ? "pointer-events-auto flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl ring-1 ring-slate-700" : "sr-only"}>
        {shown ? <CheckCircle2 size={18} className="shrink-0 text-emerald-400" aria-hidden="true" /> : null}
        {shown}
      </div>
    </div>
  );
}
