"use client";

import { startTransition, useActionState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { showToast } from "@/lib/toast-client";

export default function ProfileForm({ user }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {
    errors: {}, values: { name: user.name, email: user.email, phone: user.phone },
  });
  useEffect(() => {
    if (state.savedAt) showToast("profil-disimpan");
  }, [state.savedAt]);

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form key={state.savedAt ?? 0} onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-display text-xl font-bold uppercase">Data diri</h2>
      <Field label="Nama" name="name" defaultValue={state.values.name} error={state.errors.name} autoComplete="name" />
      <Field label="Email" name="email" type="email" defaultValue={state.values.email} error={state.errors.email} autoComplete="email" />
      <Field label="Nomor HP" name="phone" type="tel" defaultValue={state.values.phone} error={state.errors.phone} autoComplete="tel" />
      <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
    </form>
  );
}
