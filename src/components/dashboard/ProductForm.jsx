"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import ImageInput from "@/components/dashboard/ImageInput";

function Card({ title, children }) {
  return (
    <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="mb-4 font-display text-xl font-bold uppercase">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const control = (error) =>
  `block w-full rounded-lg bg-white px-3 text-base ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${error ? "ring-red-500" : "ring-slate-300"}`;

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
    <form onSubmit={onSubmit} className="mt-5 pb-24 md:pb-0" noValidate>
      {state.message ? <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-5">
          <Card title="Informasi Produk">
            <Field label="Nama produk" name="name" defaultValue={v.name} error={state.errors.name} placeholder="Contoh: Velg Racing 17 inci" />
            <div>
              <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-slate-700">Kategori</label>
              <select id="categoryId" name="categoryId" defaultValue={v.categoryId} aria-invalid={state.errors.categoryId ? true : undefined}
                className={`${control(state.errors.categoryId)} min-h-11`}>
                <option value="">Pilih kategori</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {state.errors.categoryId ? <p className="mt-1 text-sm text-red-600">{state.errors.categoryId}</p> : null}
            </div>
            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea id="description" name="description" rows={6} defaultValue={v.description} aria-invalid={state.errors.description ? true : undefined}
                className={`${control(state.errors.description)} py-2`} />
              <p className="mt-1 text-xs text-slate-500">Akhiri dengan “Cocok untuk: …” agar mudah dicari.</p>
              {state.errors.description ? <p className="mt-1 text-sm text-red-600">{state.errors.description}</p> : null}
            </div>
          </Card>

          <Card title="Harga & Stok">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium text-slate-700">Harga</label>
                <div className="flex">
                  <span className="inline-flex min-h-11 items-center rounded-l-lg bg-slate-100 px-3 text-sm font-semibold text-slate-600 ring-1 ring-slate-300">Rp</span>
                  <input id="price" name="price" inputMode="numeric" defaultValue={v.price} placeholder="10.000" aria-invalid={state.errors.price ? true : undefined}
                    className={`${control(state.errors.price)} min-h-11 rounded-l-none`} />
                </div>
                {state.errors.price ? <p className="mt-1 text-sm text-red-600">{state.errors.price}</p> : <p className="mt-1 text-xs text-slate-500">Boleh pakai titik, mis. 1.250.000</p>}
              </div>
              <Field label="Stok" name="stock" inputMode="numeric" defaultValue={v.stock} error={state.errors.stock} placeholder="0" />
            </div>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6">
          <Card title="Gambar">
            <ImageInput label="Foto produk" currentUrl={imageUrl} error={state.errors.image} required={!product} />
          </Card>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-slate-200 bg-white p-3 md:static md:mt-5 md:border-0 md:bg-transparent md:p-0">
        <Button type="submit" disabled={pending} className="flex-1 md:flex-none">{pending ? "Menyimpan…" : "Simpan"}</Button>
        <Button as={Link} href="/seller/products" variant="secondary" className="flex-1 md:flex-none">Batal</Button>
      </div>
    </form>
  );
}
