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
    <form onSubmit={onSubmit} className="mt-5 max-w-lg space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200" noValidate>
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <Field label="Nama toko" name="name" defaultValue={state.values.name} error={state.errors.name} />
      <div>
        <label htmlFor="store-desc" className="mb-1 block text-sm font-medium text-slate-700">Deskripsi (opsional)</label>
        <textarea id="store-desc" name="description" rows={4} defaultValue={state.values.description}
          className="block w-full rounded-lg bg-white px-3 py-2 text-base ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" />
      </div>
      <ImageInput label="Gambar toko" currentUrl={imageUrl} error={state.errors.image} />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
        <Button as={Link} href="/seller/store" variant="secondary">Batal</Button>
      </div>
    </form>
  );
}
