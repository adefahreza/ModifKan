import Link from "next/link";
import { BadgeCheck, Store, Truck } from "lucide-react";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import CategoryIcon from "@/components/shop/CategoryIcon";
import ProductGrid from "@/components/shop/ProductGrid";

export const dynamic = "force-dynamic";

const PERKS = [
  { icon: BadgeCheck, text: "Seller terverifikasi" },
  { icon: Store, text: "Banyak toko, satu checkout" },
  { icon: Truck, text: "Lacak status pesanan" },
];

export default async function Home() {
  const user = await getCurrentUser();
  const isBuyer = user?.role === "buyer";
  const [{ rows: categories }, { rows: products }] = await Promise.all([
    query("categories/list"),
    query(isBuyer ? "products/random" : "products/latest", [10]),
  ]);

  const wishlistIds = isBuyer ? (await query("wishlist/ids", [user.id])).rows.map((r) => r.product_id) : [];

  return (
    <div className="space-y-8">
      <section className="stripe-red relative overflow-hidden rounded-xl bg-slate-900 px-6 py-12 sm:px-10 sm:py-16">
        <div aria-hidden="true" className="absolute -right-16 -top-16 size-64 rounded-full border-[28px] border-slate-700/40" />
        <div className="relative max-w-xl">
          <h1 className="font-display text-5xl font-extrabold uppercase italic leading-none text-white sm:text-6xl">
            Upgrade <span className="text-red-500">tungganganmu.</span>
          </h1>
          <p className="mt-4 text-slate-300">Sparepart dan part modifikasi mobil dari banyak toko terverifikasi, dalam satu keranjang.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} href="/products" size="lg">Belanja sekarang</Button>
            {user ? null : <Button as={Link} href="/register?role=seller" size="lg" variant="secondary">Buka toko</Button>}
          </div>
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <span className="flex size-10 items-center justify-center rounded-lg bg-red-50 text-red-600"><Icon size={20} aria-hidden="true" /></span>
            <span className="text-sm font-semibold text-slate-900">{text}</span>
          </li>
        ))}
      </ul>

      <section aria-labelledby="kategori">
        <h2 id="kategori" className="mb-3 font-display text-2xl font-bold uppercase text-slate-900">Kategori</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {categories.map((c) => (
            <Link key={c.id} href={`/products?category=${c.id}`}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl bg-white p-3 text-center ring-1 ring-slate-200 transition-colors hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <CategoryIcon name={c.name} size={26} className="text-red-600" />
              <span className="text-xs font-semibold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="produk">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="produk" className="font-display text-2xl font-bold uppercase text-slate-900">{isBuyer ? "Rekomendasi untukmu" : "Produk terbaru"}</h2>
          <Link href="/products" className="text-sm font-semibold text-red-600 hover:underline">Lihat semua</Link>
        </div>
        <ProductGrid products={products} showCart={!user || isBuyer} wishlistIds={wishlistIds} empty={<p className="text-slate-600">Belum ada produk.</p>} />
      </section>
    </div>
  );
}
