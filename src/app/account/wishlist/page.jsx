import Link from "next/link";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import ProductGrid from "@/components/shop/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = { title: "Wishlist — ModifKan" };

export default async function WishlistPage() {
  const user = await requireRole("buyer");
  const { rows: products } = await query("wishlist/list", [user.id]);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Wishlist</h1>
      <ProductGrid
        products={products}
        showWishlist
        wishlistIds={products.map((p) => p.id)}
        empty={
          <>
            <p className="font-semibold text-slate-900">Wishlist masih kosong</p>
            <Link href="/products" className="text-sm font-semibold text-red-600 hover:underline">Jelajahi produk</Link>
          </>
        }
      />
    </div>
  );
}
