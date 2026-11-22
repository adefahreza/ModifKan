import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Mail, Package, Pencil, Phone, Store, User } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import ProductImage from "@/components/shop/ProductImage";
import { formatDate, formatRupiah, imageUrl } from "@/lib/format";
import StockLabel from "@/components/shop/StockLabel";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/dashboard/StatCard";

export const metadata = { title: "Toko Saya — ModifKan" };

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="break-words text-sm text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

export default async function StorePage({ searchParams }) {
  const user = await requireApprovedSeller();
  const sp = await searchParams;
  const [{ rows }, { rows: stats }, { rows: products }] = await Promise.all([
    query("stores/find-by-id", [user.storeId]),
    query("stores/seller-stats", [user.storeId]),
    query("products/list-by-store", [user.storeId]),
  ]);
  const latest = products.slice(0, 4); // daftar sudah terurut dari yang terbaru
  const store = rows[0];
  if (!store) notFound();
  const photo = imageUrl(store.image);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">Toko Saya</h1>
        <Button as={Link} href="/seller/store/edit"><Pencil size={16} aria-hidden="true" /> Edit Toko</Button>
      </div>

      {/* Banner toko bergaya Pit Lane: latar gelap dengan garis miring merah */}
      <section className="stripe-red mt-5 flex flex-col gap-5 rounded-xl bg-slate-900 p-5 text-white sm:flex-row sm:items-center sm:p-6">
        <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 text-slate-400 ring-2 ring-white/20 sm:size-36">
          {photo ? <ProductImage src={photo} alt={`Gambar toko ${store.name}`} fallback={<Store size={40} aria-hidden="true" />} className="size-full object-cover" /> : <Store size={40} aria-hidden="true" />}
        </div>
        <div className="min-w-0">
          <h2 className="break-words font-display text-4xl font-bold uppercase leading-none">{store.name}</h2>
          <Badge tone="emerald" className="mt-3"><BadgeCheck size={14} aria-hidden="true" /> Seller terverifikasi</Badge>
          <p className="mt-3 max-w-2xl whitespace-pre-line text-sm text-slate-300">{store.description || "Belum ada deskripsi toko."}</p>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-4 font-display text-xl font-bold uppercase">Info Pemilik</h2>
          <dl className="space-y-4">
            <InfoRow icon={User} label="Nama pemilik">{user.name}</InfoRow>
            <InfoRow icon={Mail} label="Email">{user.email}</InfoRow>
            <InfoRow icon={Phone} label="Nomor HP">{user.phone}</InfoRow>
            <InfoRow icon={Store} label="Bergabung sejak">{formatDate(store.created_at)}</InfoRow>
          </dl>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
          <StatCard label="Produk" value={stats[0].product_count} href="/seller/products" />
          <StatCard label="Stok habis" value={stats[0].out_of_stock_count} href="/seller/products" />
        </div>
      </div>

      <section aria-labelledby="store-products-title" className="mt-5 rounded-xl bg-white p-5 ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="store-products-title" className="font-display text-xl font-bold uppercase">Produk toko</h2>
          <Link href="/seller/products" className="inline-flex min-h-11 items-center text-sm font-semibold text-red-600 hover:underline">Kelola produk</Link>
        </div>
        {latest.length === 0 ? (
          <EmptyState icon={Package} title="Belum ada produk" description="Produk yang Anda tambahkan akan tampil di sini." />
        ) : (
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {latest.map((p) => (
              <li key={p.id}>
                <Link href={`/seller/products/${p.id}/edit`} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <ProductImage src={imageUrl(p.image)} alt={p.name} categoryName={p.category_name} iconSize={32} loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <StockLabel stock={p.stock} className="absolute right-2 top-2" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-red-600">{p.name}</p>
                  <p className="font-display text-lg font-bold text-slate-900">{formatRupiah(p.price)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
