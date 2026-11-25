"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { updateStoreAction } from "@/lib/actions/stores";
import Field from "@/components/ui/Field";
import ImageInput from "@/components/dashboard/ImageInput";
import Button from "@/components/ui/Button";

// Satu kartu: header (banner toko dari server), kolom gambar + kolom info, lalu footer tombol.
export default function StoreForm({ store, owner, imageUrl, header }) {
  const [state, formAction, pending] = useActionState(updateStoreAction, {
    errors: {}, values: { name: store.name, description: store.description ?? "", email: owner.email, phone: owner.phone },
  });
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form onSubmit={onSubmit} className="mt-5 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200" noValidate>
      {header}
      {state.message ? <p role="alert" className="mx-5 mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <div className="grid divide-y divide-slate-200 md:grid-cols-[17rem_minmax(0,1fr)] md:divide-x md:divide-y-0">
        <section aria-labelledby="store-image-title" className="p-5 sm:p-6">
          <h2 id="store-image-title" className="mb-3 font-display text-xl font-bold uppercase">Gambar toko</h2>
          <ImageInput label="File gambar" currentUrl={imageUrl} error={state.errors.image} />
        </section>
        <section aria-labelledby="store-info-title" className="space-y-4 p-5 sm:p-6">
          <div>
            <h2 id="store-info-title" className="font-display text-xl font-bold uppercase">Info toko</h2>
            <p className="text-sm text-slate-500">Nama dan deskripsi tampil di halaman produk Anda.</p>
          </div>
          <Field label="Nama toko" name="name" defaultValue={state.values.name} error={state.errors.name} />
          <div>
            <label htmlFor="store-desc" className="mb-1 block text-sm font-medium text-slate-700">Deskripsi (opsional)</label>
            <textarea id="store-desc" name="description" rows={6} defaultValue={state.values.description}
              className="block w-full rounded-lg bg-white px-3 py-2 text-base ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" />
          </div>
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-semibold text-slate-900">Kontak pemilik</h3>
            <p className="text-sm text-slate-500">Email dipakai untuk masuk ke akun.</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.values.email} error={state.errors.email} />
              <Field label="No. HP" name="phone" type="tel" autoComplete="tel" defaultValue={state.values.phone} error={state.errors.phone} />
            </div>
          </div>
        </section>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
        <Button as={Link} href="/seller/store" variant="secondary">Batal</Button>
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
      </div>
    </form>
  );
}
