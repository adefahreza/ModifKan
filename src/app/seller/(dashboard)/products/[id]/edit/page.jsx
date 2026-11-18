import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { imageUrl } from "@/lib/format";
import { updateProductAction } from "@/lib/actions/products";
import ProductForm from "@/components/dashboard/ProductForm";

export const metadata = { title: "Edit Produk — ModifKan" };

export default async function EditProductPage({ params }) {
  const user = await requireApprovedSeller();
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const [{ rows }, { rows: categories }] = await Promise.all([
    query("products/find-by-store", [Number(id), user.storeId]),
    query("categories/list"),
  ]);
  if (!rows[0]) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href="/seller/products" className="hover:text-slate-900">Produk</Link> / <span aria-current="page" className="text-slate-900">Edit Produk</span></nav>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase">Edit Produk</h1>
      <ProductForm action={updateProductAction.bind(null, rows[0].id)} categories={categories} product={rows[0]} imageUrl={imageUrl(rows[0].image)} />
    </>
  );
}
