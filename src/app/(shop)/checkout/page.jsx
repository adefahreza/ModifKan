import { redirect } from "next/navigation";
import { Store } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { groupCartByStore } from "@/lib/cart-rules";
import { formatRupiah } from "@/lib/format";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checkout — ModifKan" };

export default async function CheckoutPage() {
  const user = await requireRole("buyer");
  const { rows } = await query("cart/list", [user.id]);
  if (rows.length === 0) redirect("/cart");
  const cart = groupCartByStore(rows);
  if (cart.groups.some((g) => g.items.some((i) => i.unavailable))) redirect("/cart");

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.groups.map((g) => (
            <section key={g.storeId} className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              <h2 className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                <Store size={18} aria-hidden="true" /> {g.storeName}
              </h2>
              <ul className="divide-y divide-slate-200">
                {g.items.map((it) => (
                  <li key={it.product_id} className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                    <span className="min-w-0 text-slate-900">{it.name} <span className="text-slate-500">× {it.qty}</span></span>
                    <span className="shrink-0 font-semibold">{formatRupiah(it.subtotal)}</span>
                  </li>
                ))}
              </ul>
              <p className="flex justify-between border-t border-slate-200 px-4 py-3 text-sm">
                <span className="text-slate-600">Subtotal toko</span><span className="font-semibold">{formatRupiah(g.subtotal)}</span>
              </p>
            </section>
          ))}
        </div>
        <aside className="space-y-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 lg:self-start" aria-label="Ringkasan pesanan">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-slate-600">Total</span>
            <span className="font-display text-2xl font-bold">{formatRupiah(cart.total)}</span>
          </div>
          <p className="text-xs text-slate-500">Satu pesanan dibuat untuk setiap toko.</p>
          <CheckoutForm />
        </aside>
      </div>
    </div>
  );
}
