"use client";

import { startTransition, useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { changePasswordAction } from "@/lib/actions/profile";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";

// Isian tetap ada saat validasi gagal; setelah berhasil, form dipasang ulang (key) agar password tidak tertinggal.
export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, { errors: {}, values: {} });
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form key={state.savedAt ?? 0} onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-display text-xl font-bold uppercase">Ganti password</h2>
      <Field label="Password lama" name="oldPassword" type="password" error={state.errors.oldPassword} autoComplete="current-password" />
      <Field label="Password baru" name="newPassword" type="password" error={state.errors.newPassword} autoComplete="new-password" hint="Minimal 8 karakter" />
      <Field label="Konfirmasi password baru" name="confirmPassword" type="password" error={state.errors.confirmPassword} autoComplete="new-password" />
      <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Ganti password"}</Button>
      {state.message && !pending ? (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={16} aria-hidden="true" /> {state.message}
        </p>
      ) : null}
    </form>
  );
}
