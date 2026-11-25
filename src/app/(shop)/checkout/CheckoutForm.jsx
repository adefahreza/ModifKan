"use client";

import { startTransition, useActionState } from "react";
import Link from "next/link";
import { checkoutAction } from "@/lib/actions/orders";
import Button from "@/components/ui/Button";

export default function CheckoutForm({ addresses }) {
  const [state, formAction, pending] = useActionState(checkoutAction, { message: "" });
  const hasAddress = addresses.length > 0;

  // Kirim manual: React mereset <form action> setelah action selesai, sehingga alamat pilihan kembali ke yang pertama.
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form action={formAction} onSubmit={onSubmit} className="space-y-3">
      <fieldset className="space-y-2">
        <legend className="mb-1 text-sm font-semibold text-slate-900">Alamat pengiriman</legend>
        {hasAddress ? addresses.map((a, i) => (
          <label key={a.id} className="flex cursor-pointer items-start gap-3 rounded-lg p-3 text-sm ring-1 ring-slate-300 has-[:checked]:bg-red-50 has-[:checked]:ring-red-500">
            <input type="radio" name="address_id" value={a.id} defaultChecked={i === 0} className="mt-1 size-4 accent-red-600" />
            <span className="text-slate-700">
              <span className="block font-semibold text-slate-900">{a.recipient} · {a.phone}</span>
              {a.address}, {a.city} {a.postal_code}
            </span>
          </label>
        )) : (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Belum ada alamat pengiriman.{" "}
            <Link href="/account/addresses/new?next=/checkout" className="font-semibold underline">Tambah alamat</Link>
          </p>
        )}
        {hasAddress ? (
          <Link href="/account/addresses/new?next=/checkout" className="inline-block text-sm font-semibold text-red-600 hover:underline">Tambah alamat</Link>
        ) : null}
      </fieldset>
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      {hasAddress
        ? <Button type="submit" size="lg" className="w-full" disabled={pending}>{pending ? "Memproses…" : "Buat Pesanan"}</Button>
        : <Button type="submit" size="lg" className="w-full" disabled>Buat Pesanan</Button>}
    </form>
  );
}
