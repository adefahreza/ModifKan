"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast-client";

export default function CartItemControls({ productId, qty, stock, name, removeOnly = false }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function send(method, body) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/cart", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.status === 401) return router.push("/login?next=/cart");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return setError(data.error ?? "Gagal memperbarui keranjang");
      showToast(method === "DELETE" ? "keranjang-dihapus" : "keranjang-diperbarui");
      router.refresh();
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setBusy(false);
    }
  }

  const btn = "inline-flex size-11 items-center justify-center rounded-lg ring-1 ring-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";
  return (
    <div>
      <div className="flex items-center gap-2">
        {removeOnly ? null : <button type="button" className={btn} aria-label={`Kurangi jumlah ${name}`} disabled={busy || qty <= 1} onClick={() => send("PATCH", { productId, qty: qty - 1 })}><Minus size={18} /></button>}
        <span className="min-w-8 text-center font-semibold" aria-live="polite">{qty}</span>
        {removeOnly ? null : <button type="button" className={btn} aria-label={`Tambah jumlah ${name}`} disabled={busy || qty >= stock} onClick={() => send("PATCH", { productId, qty: qty + 1 })}><Plus size={18} /></button>}
        <button type="button" className={`${btn} text-red-600`} aria-label={`Hapus ${name} dari keranjang`} disabled={busy} onClick={() => send("DELETE", { productId })}><Trash2 size={18} /></button>
      </div>
      {error ? <p role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
