"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

function Stepper({ qty, setQty, stock }) {
  const btn = "inline-flex size-11 items-center justify-center rounded-lg ring-1 ring-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label="Kurangi jumlah" className={btn} disabled={qty <= 1} onClick={() => setQty(qty - 1)}><Minus size={18} /></button>
      <span className="min-w-8 text-center font-semibold" aria-live="polite">{qty}</span>
      <button type="button" aria-label="Tambah jumlah" className={btn} disabled={qty >= stock} onClick={() => setQty(qty + 1)}><Plus size={18} /></button>
    </div>
  );
}

export default function BuyBox({ productId, price, stock }) {
  const [qty, setQty] = useState(1);
  const soldOut = stock === 0;

  return (
    <>
      <aside className="hidden rounded-xl bg-white p-4 ring-1 ring-slate-200 lg:sticky lg:top-4 lg:block" aria-label="Beli produk">
        <p className="mb-3 font-semibold text-slate-900">Atur jumlah</p>
        {soldOut ? <p className="text-sm text-slate-600">Stok habis</p> : (
          <>
            <div className="flex items-center justify-between">
              <Stepper qty={qty} setQty={setQty} stock={stock} />
              <span className="text-sm text-slate-500">Stok {stock}</span>
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="font-display text-2xl font-bold">{formatRupiah(price * qty)}</span>
            </div>
          </>
        )}
        <div className="mt-4"><AddToCartButton productId={productId} qty={qty} disabled={soldOut} className="w-full" /></div>
      </aside>

      <div className="fixed inset-x-0 bottom-16 z-30 flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-2 lg:hidden">
        {soldOut ? <p className="flex-1 text-sm font-semibold text-slate-600">Stok habis</p> : (
          <>
            <Stepper qty={qty} setQty={setQty} stock={stock} />
            <p className="ml-auto font-display text-xl font-bold">{formatRupiah(price * qty)}</p>
          </>
        )}
        <AddToCartButton productId={productId} qty={qty} disabled={soldOut} label="Tambah" messageClassName="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white" />
      </div>
    </>
  );
}
