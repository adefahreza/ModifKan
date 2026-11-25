"use client";

import { startTransition, useActionState, useEffect } from "react";
import { Info } from "lucide-react";
import { changePasswordAction } from "@/lib/actions/profile";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { showToast } from "@/lib/toast-client";

// Tampil di kolom kanan menggantikan biodata. Isian tetap ada saat validasi gagal; password tidak dikirim balik dari server.
export default function PasswordForm({ onDone }) {
  const [state, formAction, pending] = useActionState(changePasswordAction, { errors: {}, values: {} });
  useEffect(() => {
    if (!state.savedAt) return;
    showToast("password-diubah");
    onDone();
  }, [state.savedAt, onDone]);

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }
  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col">
      <h2 className="font-bold text-slate-700">Ganti Password</h2>
      <div className="mt-3 grid max-w-xl gap-4">
        <Field label="Password lama" name="oldPassword" type="password" error={state.errors.oldPassword} autoComplete="current-password" autoFocus />
        <Field label="Password baru" name="newPassword" type="password" error={state.errors.newPassword} autoComplete="new-password" hint="Minimal 8 karakter" />
        <Field label="Konfirmasi password baru" name="confirmPassword" type="password" error={state.errors.confirmPassword} autoComplete="new-password" />
      </div>
      <p className="mt-4 flex max-w-xl items-start gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600">
        <Info size={14} aria-hidden="true" className="mt-0.5 shrink-0" /> Setelah diganti, sesi di perangkat lain otomatis keluar.
      </p>
      <div className="mt-auto flex justify-end gap-2 pt-6">
        <Button variant="secondary" onClick={onDone} disabled={pending}>Batal</Button>
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
      </div>
    </form>
  );
}
