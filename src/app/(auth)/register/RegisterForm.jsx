"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { registerAction } from "@/lib/actions/auth";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

const ROLES = [
  { value: "buyer", label: "Pembeli" },
  { value: "seller", label: "Penjual" },
];

export default function RegisterForm({ initialRole = "buyer" }) {
  const [state, formAction, pending] = useActionState(registerAction, { errors: {}, values: {} });
  const [role, setRole] = useState(state.values.role ? (state.values.role === "seller" ? "seller" : "buyer") : initialRole);
  const formRef = useRef(null);
  const v = state.values;
  const e = state.errors;

  // Password tidak dipertahankan setelah server menolak.
  useEffect(() => {
    if (Object.keys(state.errors).length === 0) return;
    const { password, confirmPassword } = formRef.current.elements;
    password.value = "";
    confirmPassword.value = "";
  }, [state]);

  // Kirim manual: React mereset <form action> setelah action selesai, sehingga radio peran diam-diam kembali ke
  // pilihan awal. `action` tetap dipasang agar submit sebelum hidrasi tetap POST (password tidak masuk URL).
  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
      <fieldset>
        <legend className="mb-1 text-sm font-medium text-slate-700">Daftar sebagai</legend>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          {ROLES.map((r) => (
            <label key={r.value} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-md text-sm font-semibold transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-red-500 ${role === r.value ? "bg-slate-900 text-white" : "text-slate-600"}`}>
              <input type="radio" name="role" value={r.value} checked={role === r.value} onChange={() => setRole(r.value)} className="sr-only" />
              {r.label}
            </label>
          ))}
        </div>
        {e.role ? <p className="mt-1 text-sm text-red-600">{e.role}</p> : null}
      </fieldset>
      <Field label="Nama lengkap" name="name" autoComplete="name" defaultValue={v.name} error={e.name} />
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={v.email} error={e.email} />
      <Field label="Nomor HP" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} error={e.phone} hint="Contoh: 081234567890" />
      {role === "seller" ? (
        <>
          <Field label="Nama toko" name="storeName" defaultValue={v.storeName} error={e.storeName} />
          <Field label="Foto KTP / tanda pengenal" name="ktp" type="file" accept="image/jpeg,image/png,image/webp" error={e.ktp}
            hint="JPG, PNG, atau WEBP, maksimal 2 MB. Hanya dilihat admin untuk verifikasi."
            className="[&_input]:py-2 [&_input]:text-sm [&_input]:file:mr-3 [&_input]:file:rounded-md [&_input]:file:border-0 [&_input]:file:bg-slate-900 [&_input]:file:px-3 [&_input]:file:py-1.5 [&_input]:file:text-sm [&_input]:file:font-semibold [&_input]:file:text-white" />
        </>
      ) : null}
      <Field label="Password" name="password" type="password" autoComplete="new-password" error={e.password} hint="Minimal 8 karakter" />
      <Field label="Konfirmasi password" name="confirmPassword" type="password" autoComplete="new-password" error={e.confirmPassword} />
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Mendaftar…" : "Daftar"}</Button>
    </form>
  );
}
