import Link from "next/link";
import { formatRupiah, imageUrl } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";
import CategoryIcon from "./CategoryIcon";
import RatingStars from "./RatingStars";
import StockLabel from "./StockLabel";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product, showCart = true, showWishlist = false, saved = false }) {
  const p = product;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-slate-200 transition-shadow duration-200 hover:shadow-xl">
      <div className="relative">
      <Link href={`/products/${p.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {p.image ? (
            <img src={imageUrl(p.image)} alt={p.name} loading="lazy" className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex size-full items-center justify-center text-slate-400"><CategoryIcon name={p.category_name} size={40} /></div>
          )}
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
            <CategoryIcon name={p.category_name} size={12} /> {p.category_name}
          </span>
          <StockLabel stock={p.stock} className="absolute right-2 top-2" />
        </div>
      </Link>
      {showWishlist ? <WishlistButton productId={p.id} initialSaved={saved} className="absolute bottom-2 right-2" /> : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link href={`/products/${p.id}`} className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-900 hover:text-red-600">{p.name}</Link>
        <p className="truncate text-xs text-slate-500">{p.store_name}</p>
        <div className="min-h-5"><RatingStars rating={p.avg_rating} count={p.review_count} /></div>
        <p className="mt-auto pt-1 font-display text-xl font-bold text-slate-900">{formatRupiah(p.price)}</p>
        {showCart ? (
          <div className="mt-2">
            <AddToCartButton productId={p.id} disabled={p.stock === 0} size="sm" className="w-full" label={p.stock === 0 ? "Stok habis" : "Tambah"} />
          </div>
        ) : null}
      </div>
    </article>
  );
}
