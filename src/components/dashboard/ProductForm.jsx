"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import ImageInput from "@/components/dashboard/ImageInput";

export default function ProductForm({ action, categories, product, imageUrl }) {
  const [state, formAction, pending] = useActionState(action, {
    errors: {},
    values: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? String(product.price) : "",
      stock: product ? String(product.stock) : "",
      categoryId: product ? String(product.category_id) : "",
    },
  });
  const v = state.values;

  // Kirim manual agar React tidak mereset form (gambar & pilihan hilang) saat ada error validasi.
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form onSubmit={onSubmit} className="mt-5 max-w-xl space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200" noValidate>
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <Field label="Nama produk" name="name" defaultValue={v.name} error={state.errors.name} />
      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-slate-700">Kategori</label>
        <select id="categoryId" name="categoryId" defaultValue={v.categoryId} aria-invalid={state.errors.categoryId ? true : undefined}
          className={`block min-h-11 w-full rounded-lg bg-white px-3 text-base ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${state.errors.categoryId ? "ring-red-500" : "ring-slate-300"}`}>
          <option value="">Pilih kategori</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {state.errors.categoryId ? <p className="mt-1 text-sm text-red-600">{state.errors.categoryId}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Harga (Rp)" name="price" inputMode="numeric" defaultValue={v.price} error={state.errors.price} />
        <Field label="Stok" name="stock" inputMode="numeric" defaultValue={v.stock} error={state.errors.stock} />
      </div>
      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
        <textarea id="description" name="description" rows={5} defaultValue={v.description} aria-invalid={state.errors.description ? true : undefined}
          className={`block w-full rounded-lg bg-white px-3 py-2 text-base ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${state.errors.description ? "ring-red-500" : "ring-slate-300"}`} />
        <p className="mt-1 text-xs text-slate-500">Akhiri dengan “Cocok untuk: …” agar mudah dicari.</p>
        {state.errors.description ? <p className="mt-1 text-sm text-red-600">{state.errors.description}</p> : null}
      </div>
      <ImageInput label="Gambar produk" currentUrl={imageUrl} error={state.errors.image} required={!product} />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
        <Button as={Link} href="/seller/products" variant="secondary">Batal</Button>
      </div>
    </form>
  );
}
