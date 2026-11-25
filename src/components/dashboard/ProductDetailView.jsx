import { BadgeCheck, MessageSquare, Store } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/shop/ProductImage";
import CategoryIcon from "@/components/shop/CategoryIcon";
import RatingStars from "@/components/shop/RatingStars";
import StockLabel from "@/components/shop/StockLabel";
import { formatDate, formatRupiah, imageUrl } from "@/lib/format";

const STORE_TONE = { pending: "amber", approved: "emerald", rejected: "red", suspended: "orange" };
const STORE_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected", suspended: "Ditangguhkan" };

// Info produk (hanya lihat) di dalam dashboard Seller/Admin. Tombol aksi diberikan lewat `actions`.
export default function ProductDetailView({ product: p, reviews, breadcrumb, actions, showStore = false }) {
  return (
    <div className="space-y-6">
      {breadcrumb}

      <div className="grid gap-6 rounded-xl bg-white p-5 ring-1 ring-slate-200 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200">
          <ProductImage src={imageUrl(p.image)} alt={p.name} categoryName={p.category_name} iconSize={64} className="size-full object-cover" />
        </div>

        <div className="min-w-0 space-y-4">
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

          {showStore ? (
            <p className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
              <Store size={16} aria-hidden="true" className="text-slate-500" />
              <span className="font-semibold">{p.store_name}</span>
              <Badge tone={STORE_TONE[p.store_status]}>{STORE_LABEL[p.store_status]}</Badge>
            </p>
          ) : null}

          <div>
            <h2 className="mb-1 font-semibold text-slate-900">Deskripsi</h2>
            <p className="whitespace-pre-line text-slate-700">{p.description}</p>
          </div>
          <p className="text-xs text-slate-500">Ditambahkan {formatDate(p.created_at)} · Diperbarui {formatDate(p.updated_at)}</p>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>

      <section aria-labelledby="ulasan" className="space-y-3">
        <h2 id="ulasan" className="font-display text-2xl font-bold uppercase text-slate-900">Ulasan</h2>
        {reviews.length === 0 ? (
          <EmptyState icon={MessageSquare} title="Belum ada ulasan" className="py-8" />
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
            {reviews.map((r, i) => (
              <li key={i} className="p-4">
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
        )}
      </section>
    </div>
  );
}
