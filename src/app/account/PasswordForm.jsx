"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { changePasswordAction } from "@/lib/actions/profile";
import Field from "@/components/ui/Field";
import SubmitButton from "@/components/SubmitButton";

// Memakai form action biasa: React mengosongkan isian setelah submit, jadi password tidak tertinggal di form.
export default function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, { errors: {}, values: {} });
  return (
    <form action={formAction} noValidate className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="font-display text-xl font-bold uppercase">Ganti password</h2>
      <Field label="Password lama" name="oldPassword" type="password" error={state.errors.oldPassword} autoComplete="current-password" />
      <Field label="Password baru" name="newPassword" type="password" error={state.errors.newPassword} autoComplete="new-password" hint="Minimal 8 karakter" />
      <Field label="Konfirmasi password baru" name="confirmPassword" type="password" error={state.errors.confirmPassword} autoComplete="new-password" />
      <SubmitButton>Ganti password</SubmitButton>
      {state.message ? (
        <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={16} aria-hidden="true" /> {state.message}
        </p>
      ) : null}
    </form>
  );
}
