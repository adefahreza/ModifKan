"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";
import { showToast } from "@/lib/toast-client";

export default function WishlistButton({ productId, initialSaved = false, showLabel = false, className = "" }) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !saved;
    setSaved(next); // optimistic
    setPending(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.status === 401) {
        setSaved(!next);
        router.push("/login?next=" + encodeURIComponent(pathname + (search ? `?${search}` : "")));
        return;
      }
      if (!res.ok) {
        setSaved(!next);
        return;
      }
      showToast(next ? "wishlist-disimpan" : "wishlist-dihapus");
      if (pathname.startsWith("/account/wishlist")) router.refresh();
    } catch {
      setSaved(!next);
    } finally {
      setPending(false);
    }
  }

  const label = saved ? "Hapus dari wishlist" : "Simpan ke wishlist";
  return (
    <button type="button" onClick={toggle} disabled={pending} aria-pressed={saved} aria-label={label}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-white/95 text-slate-700 ring-1 ring-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60 ${showLabel ? "min-h-11 px-4 text-sm font-semibold" : "size-11"} ${className}`}>
      <Heart size={18} aria-hidden="true" className={saved ? "fill-red-600 text-red-600" : ""} />
      {showLabel ? <span>{saved ? "Tersimpan" : "Wishlist"}</span> : null}
    </button>
  );
}
