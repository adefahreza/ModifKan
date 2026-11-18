"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateUserAction } from "@/lib/actions/users";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/SubmitButton";

export default function UserEditForm({ user }) {
  const [state, formAction] = useActionState(updateUserAction.bind(null, user.id), {
    errors: {},
    values: { name: user.name, email: user.email, phone: user.phone },
  });
  return (
    <form action={formAction} className="mt-5 max-w-lg space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200" noValidate>
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <p className="text-sm text-slate-600">Peran: <strong>{user.role}</strong> (tidak dapat diubah)</p>
      <Field label="Nama" name="name" defaultValue={state.values.name} error={state.errors.name} />
      <Field label="Email" name="email" type="email" defaultValue={state.values.email} error={state.errors.email} />
      <Field label="Nomor HP" name="phone" type="tel" defaultValue={state.values.phone} error={state.errors.phone} />
      <div className="flex gap-2">
        <SubmitButton>Simpan</SubmitButton>
        <Button as={Link} href="/admin/users" variant="secondary">Batal</Button>
      </div>
    </form>
  );
}
