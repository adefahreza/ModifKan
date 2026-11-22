"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { updateStoreAction } from "@/lib/actions/stores";
import Field from "@/components/ui/Field";
import ImageInput from "@/components/dashboard/ImageInput";
import Button from "@/components/ui/Button";

export default function StoreForm({ store, imageUrl }) {
  const [state, formAction, pending] = useActionState(updateStoreAction, {
    errors: {}, values: { name: store.name, description: store.description ?? "" },
  });
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form onSubmit={onSubmit} className="mt-5 max-w-4xl space-y-5" noValidate>
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem] lg:items-start">
        <section aria-labelledby="store-info-title" className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <div>
            <h2 id="store-info-title" className="font-display text-xl font-bold uppercase">Info toko</h2>
            <p className="text-sm text-slate-500">Nama dan deskripsi tampil di halaman produk Anda.</p>
          </div>
          <Field label="Nama toko" name="name" defaultValue={state.values.name} error={state.errors.name} />
          <div>
            <label htmlFor="store-desc" className="mb-1 block text-sm font-medium text-slate-700">Deskripsi (opsional)</label>
            <textarea id="store-desc" name="description" rows={7} defaultValue={state.values.description}
              className="block w-full rounded-lg bg-white px-3 py-2 text-base ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" />
          </div>
        </section>
        <section aria-labelledby="store-image-title" className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 id="store-image-title" className="mb-3 font-display text-xl font-bold uppercase">Gambar toko</h2>
          <ImageInput label="File gambar" currentUrl={imageUrl} error={state.errors.image} />
        </section>
      </div>
      <div className="flex justify-end gap-2 rounded-xl bg-white px-5 py-3 ring-1 ring-slate-200">
        <Button as={Link} href="/seller/store" variant="secondary">Batal</Button>
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
      </div>
    </form>
  );
}
