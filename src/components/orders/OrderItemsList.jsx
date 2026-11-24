import Link from "next/link";
import { Package } from "lucide-react";
import ProductImage from "@/components/shop/ProductImage";
import { formatRupiah, imageUrl } from "@/lib/format";

// productHref: tujuan link nama produk. Buyer ke halaman toko; Seller/Admin ke detail produk di dashboard masing-masing.
export default function OrderItemsList({ items, renderItemExtra, productHref = (id) => `/products/${id}` }) {
  return (
    <ul className="divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
      {items.map((item) => (
        <li key={item.id} className="p-4">
          <div className="flex gap-3">
            {item.image ? (
              <ProductImage src={imageUrl(item.image)} loading="lazy" fallback={<Package size={24} aria-hidden="true" />} className="size-16 shrink-0 rounded-lg bg-slate-100 object-cover" />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <Package size={24} aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {item.product_id ? (
                <Link href={productHref(item.product_id)} className="line-clamp-2 font-semibold text-slate-900 hover:text-red-600">{item.product_name}</Link>
              ) : (
                <p className="line-clamp-2 font-semibold text-slate-900">{item.product_name}</p>
              )}
              <p className="text-sm text-slate-500">{item.qty} × {formatRupiah(item.price)}</p>
            </div>
            <p className="shrink-0 font-semibold text-slate-900">{formatRupiah(item.price * item.qty)}</p>
          </div>
          {renderItemExtra ? <div className="mt-3">{renderItemExtra(item)}</div> : null}
        </li>
      ))}
    </ul>
  );
}
