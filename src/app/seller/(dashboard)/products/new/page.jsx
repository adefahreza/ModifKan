import Link from "next/link";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { createProductAction } from "@/lib/actions/products";
import ProductForm from "@/components/dashboard/ProductForm";

export const metadata = { title: "Tambah Produk — ModifKan" };

export default async function NewProductPage() {
  await requireApprovedSeller();
  const { rows: categories } = await query("categories/list");
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href="/seller/products" className="hover:text-slate-900">Produk</Link> / <span aria-current="page" className="text-slate-900">Tambah Produk</span></nav>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase">Tambah Produk</h1>
      <ProductForm action={createProductAction} categories={categories} />
    </>
  );
}
