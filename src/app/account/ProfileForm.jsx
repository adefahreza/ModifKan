"use client";

import { startTransition, useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

export default function ProfileForm({ user }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {
    errors: {}, values: { name: user.name, email: user.email, phone: user.phone },
  });
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-display text-xl font-bold uppercase">Data diri</h2>
      <Field label="Nama" name="name" defaultValue={state.values.name} error={state.errors.name} autoComplete="name" />
      <Field label="Email" name="email" type="email" defaultValue={state.values.email} error={state.errors.email} autoComplete="email" />
      <Field label="Nomor HP" name="phone" type="tel" defaultValue={state.values.phone} error={state.errors.phone} autoComplete="tel" />
      <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
      {state.message && !pending ? (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={16} aria-hidden="true" /> {state.message}
        </p>
      ) : null}
    </form>
  );
}
