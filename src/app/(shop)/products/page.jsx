import Link from "next/link";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import FilterChips from "@/components/dashboard/FilterChips";
import ProductGrid from "@/components/shop/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = { title: "Katalog produk — ModifKan" };

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 100) : "";
  const rawCat = typeof sp.category === "string" ? sp.category : "";
  const categoryId = /^\d{1,9}$/.test(rawCat) ? Number(rawCat) : null;

  const [user, { rows: categories }, { rows: products }] = await Promise.all([
    getCurrentUser(),
    query("categories/list"),
    query("products/list-public", [q || null, categoryId]),
  ]);

  const options = [{ value: "", label: "Semua" }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))];
  const hasFilter = q !== "" || categoryId !== null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-bold uppercase text-slate-900">{q ? `Hasil untuk "${q}"` : "Semua produk"}</h1>
        <p className="text-sm text-slate-500">{products.length} produk</p>
      </div>
      <FilterChips options={options} param="category" current={categoryId === null ? "" : String(categoryId)} basePath="/products" extra={{ q }} />
      <ProductGrid
        products={products}
        showCart={!user || user.role === "buyer"}
        empty={
          <>
            <p className="font-semibold text-slate-900">Produk tidak ditemukan</p>
            {hasFilter ? <Link href="/products" className="text-sm font-semibold text-red-600 hover:underline">Reset pencarian</Link> : null}
          </>
        }
      />
    </div>
  );
}
