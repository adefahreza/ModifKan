import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import ProductDetailView from "@/components/dashboard/ProductDetailView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detail Produk — ModifKan" };

export default async function AdminProductDetailPage({ params }) {
  await requireRole("admin");
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  const { rows } = await query("products/find-admin", [Number(id)]);
  const p = rows[0];
  if (!p) notFound();
  const { rows: reviews } = await query("reviews/list-by-product", [p.id]);

  return (
    <ProductDetailView product={p} reviews={reviews} showStore
      breadcrumb={<nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href="/admin/products" className="hover:text-slate-900">Moderasi Produk</Link> / <span aria-current="page" className="text-slate-900">Detail Produk</span></nav>} />
  );
}
