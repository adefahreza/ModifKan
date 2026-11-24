import Link from "next/link";
import { notFound } from "next/navigation";
import { Pencil } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import Button from "@/components/ui/Button";
import ProductDetailView from "@/components/dashboard/ProductDetailView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detail Produk — ModifKan" };

export default async function SellerProductDetailPage({ params }) {
  const user = await requireApprovedSeller();
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  // Kepemilikan dicek di query: produk toko lain tidak ditemukan.
  const { rows } = await query("products/find-for-store-detail", [Number(id), user.storeId]);
  const p = rows[0];
  if (!p) notFound();
  const { rows: reviews } = await query("reviews/list-by-product", [p.id]);

  return (
    <ProductDetailView product={p} reviews={reviews}
      breadcrumb={<nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href="/seller/products" className="hover:text-slate-900">Produk</Link> / <span aria-current="page" className="text-slate-900">Detail Produk</span></nav>}
      actions={<Button as={Link} href={`/seller/products/${p.id}/edit`} variant="secondary"><Pencil size={16} aria-hidden="true" /> Edit produk</Button>} />
  );
}
