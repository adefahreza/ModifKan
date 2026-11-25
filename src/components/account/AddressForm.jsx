"use client";

import { startTransition, useActionState, useId } from "react";
import Link from "next/link";
import { MapPin, User } from "lucide-react";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

const EMPTY = { recipient: "", phone: "", address: "", city: "", postalCode: "" };

// Bagian bergaya pengaturan: judul + penjelasan di kiri, isian di kanan (bertumpuk di layar kecil).
function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="grid gap-4 border-t border-slate-200 py-5 first:border-t-0 first:pt-0 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-8">
      <div>
        <h2 className="flex items-center gap-2 font-bold text-slate-700"><Icon size={16} aria-hidden="true" /> {title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

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
    <form onSubmit={onSubmit} noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.message ? <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}

      <Section icon={User} title="Penerima" description="Siapa yang menerima paket.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama penerima" name="recipient" defaultValue={v.recipient} error={state.errors.recipient} autoComplete="name" />
          <Field label="Nomor HP" name="phone" type="tel" defaultValue={v.phone} error={state.errors.phone} autoComplete="tel" />
        </div>
      </Section>

      <Section icon={MapPin} title="Lokasi" description="Alamat lengkap untuk kurir.">
        <div>
          <label htmlFor={addressId} className="mb-1 block text-sm font-medium text-slate-700">Alamat lengkap</label>
          <textarea id={addressId} name="address" rows={3} defaultValue={v.address} autoComplete="street-address"
            aria-invalid={state.errors.address ? true : undefined}
            aria-describedby={state.errors.address ? `${addressId}-error` : undefined}
            className={`block w-full rounded-lg bg-white px-3 py-2 text-base text-slate-900 ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${state.errors.address ? "ring-red-500" : "ring-slate-300"}`} />
          {state.errors.address ? <p id={`${addressId}-error`} className="mt-1 text-sm text-red-600">{state.errors.address}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
          <Field label="Kota" name="city" defaultValue={v.city} error={state.errors.city} autoComplete="address-level2" />
          <Field label="Kode pos" name="postalCode" inputMode="numeric" maxLength={5} defaultValue={v.postalCode} error={state.errors.postalCode} autoComplete="postal-code" />
        </div>
      </Section>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
        <Button as={Link} href={cancelHref} variant="secondary">Batal</Button>
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : submitLabel}</Button>
      </div>
    </form>
  );
}
