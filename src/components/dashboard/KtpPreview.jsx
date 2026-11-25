"use client";

import { useState } from "react";
import { IdCard } from "lucide-react";
import Modal from "@/components/ui/Modal";

// Thumbnail KTP + modal foto besar. Gambar lewat /api/ktp (khusus admin). `children`: tombol aksi di dalam modal.
export default function KtpPreview({ ktp, storeName, ownerName, phone, children }) {
  const [open, setOpen] = useState(false);
  if (!ktp) return <span className="text-sm italic text-slate-400">Belum ada foto</span>;
  const src = `/api/ktp/${ktp}`;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Lihat KTP ${storeName}`}
        className="inline-flex min-h-9 items-center gap-2 rounded-md text-sm font-semibold text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
        <span className="relative flex h-7 w-11 items-center justify-center overflow-hidden rounded bg-blue-100 ring-1 ring-blue-200">
          <IdCard size={16} className="absolute text-blue-800" aria-hidden="true" />
          {/* Ikon di belakang tetap terlihat kalau gambar gagal dimuat. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- gambar privat, tidak lewat optimasi next/image */}
          <img src={src} alt="" loading="lazy" className="relative size-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        </span>
        Lihat
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={`KTP · ${storeName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- gambar privat, tidak lewat optimasi next/image */}
        <img src={src} alt={`KTP ${storeName}`} className="w-full rounded-lg bg-slate-100 object-contain ring-1 ring-slate-200" />
        <p className="mt-3 text-sm text-slate-600">Pemilik: {ownerName} · {phone}</p>
        {children ? <div className="mt-4 flex justify-end">{children}</div> : null}
      </Modal>
    </>
  );
}
