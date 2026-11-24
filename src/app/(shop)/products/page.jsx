import Link from "next/link";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import FilterChips from "@/components/dashboard/FilterChips";
import ProductGrid from "@/components/shop/ProductGrid";
import FilterPanel, { SortSelect } from "@/components/shop/FilterPanel";
import { parseProductFilters } from "@/lib/product-filters";

export const dynamic = "force-dynamic";

export const metadata = { title: "Katalog produk — ModifKan" };

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const filters = parseProductFilters(sp);
  const { q, categoryId, minPrice, maxPrice, minRating, sort } = filters;

  const [user, { rows: categories }, { rows: products }] = await Promise.all([
    getCurrentUser(),
    query("categories/list"),
    query("products/list-public", [q, categoryId, minPrice, maxPrice, sort, minRating]),
  ]);

  const wishlistIds = user?.role === "buyer" ? (await query("wishlist/ids", [user.id])).rows.map((r) => r.product_id) : [];
  const options = [{ value: "", label: "Semua" }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))];
  const hasFilter = q !== null || categoryId !== null || minPrice !== null || maxPrice !== null || minRating !== null;

  return (
    <FilterPanel
      categories={categories}
      filters={filters}
      header={
        <>
          <div>
            <h1 className="font-display text-3xl font-bold uppercase text-slate-900">{q ? `Hasil untuk "${q}"` : "Semua produk"}</h1>
            <p className="text-sm text-slate-500">{products.length} produk</p>
          </div>
          <FilterChips options={options} param="category" current={categoryId === null ? "" : String(categoryId)} basePath="/products"
            extra={{ q, min: minPrice === null ? "" : String(minPrice), max: maxPrice === null ? "" : String(maxPrice), rating: minRating === null ? "" : String(minRating), sort: sort === "terbaru" ? "" : sort }} />
        </>
      }
    >
      <ProductGrid
        products={products}
        wishlistIds={wishlistIds}
        emptyAction={hasFilter ? <Link href="/products" className="text-sm font-semibold text-red-600 hover:underline">Reset pencarian</Link> : null}
      />
    </FilterPanel>
  );
}
