"use client";

import { useCallback, useState } from "react";
import { Lock, Store } from "lucide-react";
import StoreForm from "./StoreForm";
import PasswordForm from "@/app/account/PasswordForm";
import { changeSellerPasswordAction } from "@/lib/actions/profile";

// Seperti profil buyer: tombol Ganti Password di bawah kolom gambar, kolom kanan berganti ke form password.
// Form toko dan form password terpisah karena form tidak boleh bersarang.
export default function StoreSettings({ store, owner, imageUrl, header }) {
  const [mode, setMode] = useState("store"); // store | password
  const backToStore = useCallback(() => setMode("store"), []);

  const button = (
    <button type="button" onClick={() => setMode(mode === "password" ? "store" : "password")} aria-pressed={mode === "password"}
      className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm font-bold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${mode === "password" ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-900 ring-slate-300 hover:bg-slate-50"}`}>
      <Lock size={18} aria-hidden="true" /> <span className="flex-1 text-center">Ganti Password</span>
    </button>
  );

  if (mode === "store") return <StoreForm store={store} owner={owner} imageUrl={imageUrl} header={header} passwordButton={button} />;

  return (
    <div className="mt-5 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
      {header}
      <div className="grid divide-y divide-slate-200 md:grid-cols-[17rem_minmax(0,1fr)] md:divide-x md:divide-y-0">
        <section aria-labelledby="store-image-title" className="flex flex-col p-5 sm:p-6">
          <h2 id="store-image-title" className="mb-3 font-display text-xl font-bold uppercase">Gambar toko</h2>
          <div className="flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400 ring-1 ring-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element -- gambar toko yang sudah tersimpan */}
            {imageUrl ? <img src={imageUrl} alt={`Gambar toko ${store.name}`} className="size-full object-cover" /> : <Store size={48} aria-hidden="true" />}
          </div>
          <div className="mt-auto pt-6">{button}</div>
        </section>
        <section className="p-5 sm:p-6">
          <PasswordForm onDone={backToStore} action={changeSellerPasswordAction} />
        </section>
      </div>
    </div>
  );
}
