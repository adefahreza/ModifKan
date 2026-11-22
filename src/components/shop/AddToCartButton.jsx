"use client";

import { useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import Button from "@/components/ui/Button";
import { CART_COUNT_EVENT } from "./CartBadge";
import { showToast } from "@/lib/toast-client";

export default function AddToCartButton({
  productId, qty = 1, disabled = false, label = "Tambah ke Keranjang", size = "md", className = "",
  messageClassName = "mt-1 block text-xs",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  function show(text, ok) {
    setMessage({ text, ok });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2500);
  }

  async function onClick() {
    setPending(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      });
      if (res.status === 401) {
        router.push("/login?next=" + encodeURIComponent(pathname + (search ? `?${search}` : "")));
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return show(data.error ?? "Gagal menambah ke keranjang", false);
      showToast("keranjang-ditambah");
      window.dispatchEvent(new CustomEvent(CART_COUNT_EVENT, { detail: data.count }));
    } catch {
      show("Gagal menghubungi server", false);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative">
      <Button size={size} className={className} disabled={disabled || pending} onClick={onClick}>
        <ShoppingCart size={16} aria-hidden="true" /> {pending ? "Menambah…" : label}
      </Button>
      <span role="status" className={message ? `${messageClassName} ${message.ok ? "text-emerald-700" : "text-red-600"}` : "sr-only"}>
        {message?.text}
      </span>
    </div>
  );
}
