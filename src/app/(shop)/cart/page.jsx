import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { AlertTriangle, ShoppingCart, Store } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { groupCartByStore } from "@/lib/cart-rules";
import { formatRupiah, imageUrl } from "@/lib/format";
import ProductImage from "@/components/shop/ProductImage";
import Button from "@/components/ui/Button";
import CartItemControls from "@/components/shop/CartItemControls";

export const dynamic = "force-dynamic";

export const metadata = { title: "Keranjang — ModifKan" };

export default async function CartPage() {
  const user = await requireRole("buyer");
  const { rows } = await query("cart/list", [user.id]);
  const cart = groupCartByStore(rows);

  if (cart.groups.length === 0) {
    return (
      <EmptyState icon={ShoppingCart} title="Keranjang masih kosong" action={<Button as={Link} href="/products">Mulai belanja</Button>} />
    );
  }

  return (
    <div className="space-y-4 pb-28 lg:pb-0">
      <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Keranjang</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.groups.map((g) => (
            <section key={g.storeId} className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
              <h2 className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900">
                <Store size={18} aria-hidden="true" /> {g.storeName}
              </h2>
              <ul className="divide-y divide-slate-200">
                {g.items.map((it) => (
                  <li key={it.product_id} className="flex gap-3 p-4">
                    <ProductImage src={imageUrl(it.image)} categoryName={it.category_name} iconSize={28} className="size-20 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Link href={`/products/${it.product_id}`} className="line-clamp-2 font-semibold text-slate-900 hover:text-red-600">{it.name}</Link>
                      <p className="font-display text-lg font-bold">{formatRupiah(it.price)}</p>
                      {it.unavailable ? (
                        <p role="alert" className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                          <AlertTriangle size={14} aria-hidden="true" /> Produk tidak lagi tersedia, hapus dari keranjang
                        </p>
                      ) : it.overStock ? (
                        <p role="alert" className="flex items-center gap-1 rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                          <AlertTriangle size={14} aria-hidden="true" /> Stok tersisa {it.stock}, kurangi jumlahnya
                        </p>
                      ) : null}
                      <CartItemControls productId={it.product_id} qty={it.qty} stock={it.stock} name={it.name} removeOnly={it.unavailable} />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="flex justify-between border-t border-slate-200 px-4 py-3 text-sm">
                <span className="text-slate-600">Subtotal toko</span><span className="font-semibold">{formatRupiah(g.subtotal)}</span>
              </p>
            </section>
          ))}
        </div>

        <aside className="fixed inset-x-0 bottom-16 z-30 border-t border-slate-200 bg-white p-4 lg:static lg:self-start lg:rounded-xl lg:border-0 lg:ring-1 lg:ring-slate-200" aria-label="Ringkasan belanja">
          <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch">
            <div className="lg:flex lg:items-baseline lg:justify-between">
              <p className="text-sm text-slate-600">Total ({cart.itemCount} barang)</p>
              <p className="font-display text-2xl font-bold">{formatRupiah(cart.total)}</p>
            </div>
            {cart.hasStockIssue ? (
              <Button disabled size="lg" className="lg:w-full">Checkout</Button>
            ) : (
              <Button as={Link} href="/checkout" size="lg" className="lg:w-full">Checkout</Button>
            )}
          </div>
          {cart.hasStockIssue ? <p className="mt-2 hidden text-xs text-amber-800 lg:block">Perbaiki jumlah yang melebihi stok atau hapus produk yang tidak tersedia sebelum checkout.</p> : null}
        </aside>
      </div>
    </div>
  );
}
