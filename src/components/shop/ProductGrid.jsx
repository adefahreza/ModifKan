import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, empty, showCart = true }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
        <PackageSearch size={40} className="text-slate-400" aria-hidden="true" />
        {empty ?? <p className="text-slate-600">Produk tidak ditemukan.</p>}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => <ProductCard key={p.id} product={p} showCart={showCart} />)}
    </div>
  );
}
