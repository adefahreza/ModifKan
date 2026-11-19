"use client";

import { useEffect, useState } from "react";

export const CART_COUNT_EVENT = "modifkan:cart-count";

// Badge jumlah item di navbar. `initial` berasal dari server; event dari AddToCartButton memperbaruinya
// tanpa me-refresh halaman (supaya daftar rekomendasi acak di beranda tidak ikut berubah).
export default function CartBadge({ initial }) {
  const [state, setState] = useState({ initial, count: initial });
  if (state.initial !== initial) setState({ initial, count: initial });

  useEffect(() => {
    const onCount = (e) => setState((s) => ({ ...s, count: e.detail }));
    window.addEventListener(CART_COUNT_EVENT, onCount);
    return () => window.removeEventListener(CART_COUNT_EVENT, onCount);
  }, []);

  if (state.count <= 0) return null;
  return (
    <span className="absolute right-0.5 top-0.5 flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
      {state.count}<span className="sr-only"> item</span>
    </span>
  );
}
