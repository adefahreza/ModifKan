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
      <h1 className="font-display text-3xl font-bold uppercase">Tambah Produk</h1>
      <ProductForm action={createProductAction} categories={categories} />
    </>
  );
}
