import { PackageSearch } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, emptyTitle = "Produk tidak ditemukan", emptyAction, showCart = true, showWishlist = showCart, wishlistIds = [] }) {
  const saved = new Set(wishlistIds);
  if (products.length === 0) return <EmptyState icon={PackageSearch} title={emptyTitle} action={emptyAction} />;
  return (
    <div data-product-grid className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5 lg:group-data-[filter-open=true]/catalog:grid-cols-3 xl:group-data-[filter-open=true]/catalog:grid-cols-4">
      {products.map((p) => <ProductCard key={p.id} product={p} showCart={showCart} showWishlist={showWishlist} saved={saved.has(p.id)} />)}
    </div>
  );
}
