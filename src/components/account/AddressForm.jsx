"use client";

import { startTransition, useActionState, useId } from "react";
import Link from "next/link";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

const EMPTY = { recipient: "", phone: "", address: "", city: "", postalCode: "" };

export default function AddressForm({ action, initial = EMPTY, next = "", cancelHref = "/account/addresses", submitLabel = "Simpan alamat" }) {
  const [state, formAction, pending] = useActionState(action, { errors: {}, values: initial });
  const addressId = useId();
  const v = state.values;

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-xl space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <Field label="Nama penerima" name="recipient" defaultValue={v.recipient} error={state.errors.recipient} autoComplete="name" />
      <Field label="Nomor HP" name="phone" type="tel" defaultValue={v.phone} error={state.errors.phone} autoComplete="tel" />
      <div>
        <label htmlFor={addressId} className="mb-1 block text-sm font-medium text-slate-700">Alamat lengkap</label>
        <textarea id={addressId} name="address" rows={3} defaultValue={v.address} autoComplete="street-address"
          aria-invalid={state.errors.address ? true : undefined}
          aria-describedby={state.errors.address ? `${addressId}-error` : undefined}
          className={`block w-full rounded-lg bg-white px-3 py-2 text-base text-slate-900 ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${state.errors.address ? "ring-red-500" : "ring-slate-300"}`} />
        {state.errors.address ? <p id={`${addressId}-error`} className="mt-1 text-sm text-red-600">{state.errors.address}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kota" name="city" defaultValue={v.city} error={state.errors.city} autoComplete="address-level2" />
        <Field label="Kode pos" name="postalCode" inputMode="numeric" maxLength={5} defaultValue={v.postalCode} error={state.errors.postalCode} autoComplete="postal-code" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : submitLabel}</Button>
        <Button as={Link} href={cancelHref} variant="secondary">Batal</Button>
      </div>
    </form>
  );
}
