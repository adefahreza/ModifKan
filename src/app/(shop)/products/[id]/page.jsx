import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, Store } from "lucide-react";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDate, formatRupiah, imageUrl } from "@/lib/format";
import BuyBox from "@/components/shop/BuyBox";
import CategoryIcon from "@/components/shop/CategoryIcon";
import RatingStars from "@/components/shop/RatingStars";
import StockLabel from "@/components/shop/StockLabel";
import WishlistButton from "@/components/shop/WishlistButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  const { rows } = await query("products/find-public", [Number(id)]);
  const p = rows[0];
  if (!p) notFound();

  const [user, { rows: reviews }] = await Promise.all([getCurrentUser(), query("reviews/list-by-product", [p.id])]);
  const canBuy = !user || user.role === "buyer";
  const saved = user?.role === "buyer" && (await query("wishlist/ids", [user.id])).rows.some((r) => r.product_id === p.id);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
        <Link href="/" className="hover:text-red-600">Beranda</Link><ChevronRight size={14} aria-hidden="true" />
        <Link href={`/products?category=${p.category_id}`} className="hover:text-red-600">{p.category_name}</Link><ChevronRight size={14} aria-hidden="true" />
        <span className="line-clamp-1 text-slate-900">{p.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
            {p.image ? <img src={imageUrl(p.image)} alt={p.name} className="size-full object-cover" /> : (
              <div className="flex size-full items-center justify-center text-slate-400"><CategoryIcon name={p.category_name} size={64} /></div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
            <CategoryIcon name={p.category_name} size={12} /> {p.category_name}
          </span>
          <h1 className="font-display text-3xl font-bold uppercase leading-tight text-slate-900">{p.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <RatingStars rating={p.avg_rating} count={p.review_count} size={16} showEmpty />
            <span className="text-sm text-slate-500">Stok {p.stock}</span>
            <StockLabel stock={p.stock} />
          </div>
          <p className="font-display text-4xl font-bold text-slate-900">{formatRupiah(p.price)}</p>
          {canBuy ? <WishlistButton productId={p.id} initialSaved={saved} showLabel className="!bg-white" /> : null}
          <div>
            <h2 className="mb-1 font-semibold text-slate-900">Deskripsi</h2>
            <p className="whitespace-pre-line text-slate-700">{p.description}</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-slate-400">
              {p.store_image ? <img src={imageUrl(p.store_image)} alt="" className="size-full object-cover" /> : <Store size={22} aria-hidden="true" />}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{p.store_name}</p>
              <p className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><BadgeCheck size={14} aria-hidden="true" /> Seller terverifikasi</p>
            </div>
          </div>
        </div>

        {canBuy ? <div className="lg:col-span-3"><BuyBox productId={p.id} price={p.price} stock={p.stock} /></div> : null}
      </div>

      <section aria-labelledby="ulasan" className="space-y-4">
        <h2 id="ulasan" className="font-display text-2xl font-bold uppercase text-slate-900">Ulasan</h2>
        {reviews.length === 0 ? (
          <p className="rounded-xl bg-white p-6 text-center text-slate-600 ring-1 ring-slate-200">Belum ada ulasan</p>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-bold">{Number(p.avg_rating).toFixed(1)}</span>
              <div><RatingStars rating={p.avg_rating} size={18} /><p className="text-sm text-slate-500">{p.review_count} ulasan</p></div>
            </div>
            <ul className="space-y-3">
              {reviews.map((r, i) => (
                <li key={i} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-slate-900">{r.buyer_name}</span>
                    <RatingStars rating={r.rating} size={14} />
                    <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>
                  </div>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"><BadgeCheck size={13} aria-hidden="true" /> Pembelian terverifikasi</p>
                  <p className="mt-2 whitespace-pre-line text-slate-700">{r.comment}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
