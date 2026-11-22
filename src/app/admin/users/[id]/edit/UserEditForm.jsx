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
    <form action={formAction} className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200" noValidate>
      <div className="space-y-4 p-5">
        <div>
          <h2 className="font-display text-xl font-bold uppercase">Data akun</h2>
          <p className="text-sm text-slate-500">Ubah nama, email, atau nomor HP pengguna.</p>
        </div>
        {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
        <Field label="Nama" name="name" defaultValue={state.values.name} error={state.errors.name} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" defaultValue={state.values.email} error={state.errors.email} />
          <Field label="Nomor HP" name="phone" type="tel" defaultValue={state.values.phone} error={state.errors.phone} />
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
        <Button as={Link} href="/admin/users" variant="secondary">Batal</Button>
        <SubmitButton>Simpan</SubmitButton>
      </div>
    </form>
  );
}
