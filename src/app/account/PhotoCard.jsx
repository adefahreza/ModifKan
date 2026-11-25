/* eslint-disable @next/next/no-img-element */
"use client";

import { startTransition, useActionState, useEffect, useId, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { removeAvatarAction, updateAvatarAction } from "@/lib/actions/profile";
import { validateAvatar } from "@/lib/validators";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import UserAvatar from "@/components/account/UserAvatar";
import { showToast } from "@/lib/toast-client";

// Isi form dipasang ulang (key) setelah tersimpan, jadi pratinjau dan input file kembali kosong.
export default function PhotoCard({ name, avatar }) {
  const [state, formAction, pending] = useActionState(updateAvatarAction, { errors: {} });
  useEffect(() => {
    if (state.savedAt) showToast("foto-profil-disimpan");
  }, [state.savedAt]);
  return (
    <section aria-label="Foto profil" className="space-y-2 rounded-xl p-3 shadow-sm ring-1 ring-slate-200">
      <PhotoForm key={state.savedAt ?? 0} name={name} avatar={avatar} state={state} formAction={formAction} pending={pending} />
    </section>
  );
}

function PhotoForm({ name, avatar, state, formAction, pending }) {
  const id = useId();
  const [preview, setPreview] = useState(null);
  const [clientError, setClientError] = useState("");

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // Cek di browser supaya file terlalu besar tidak pernah dikirim; server tetap memvalidasi ulang.
  function onChange(e) {
    const input = e.target;
    const file = input.files?.[0];
    const error = file ? validateAvatar(file).avatar : null;
    setClientError(error ?? "");
    setPreview(file && !error ? URL.createObjectURL(file) : null);
    if (error) input.value = "";
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  function onCancel(e) {
    e.currentTarget.form.reset();
    setPreview(null);
    setClientError("");
  }

  const error = clientError || state.errors?.avatar || state.message;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-2">
      <div className="aspect-square overflow-hidden rounded-lg">
        {preview
          ? <img src={preview} alt="Pratinjau foto baru" className="size-full object-cover" />
          : <UserAvatar name={name} avatar={avatar} className="size-full"
              fallbackClassName="stripe-red bg-slate-900 font-display text-7xl font-extrabold italic text-white" />}
      </div>

      {/* Disembunyikan lewat pembungkus (bukan dilepas) agar file terpilih tetap ikut terkirim. */}
      <div className={preview ? "hidden" : ""}>
        <Button as="label" variant="secondary" htmlFor={id}
          className="w-full cursor-pointer focus-within:ring-2 focus-within:ring-red-500">
          <Upload size={16} aria-hidden="true" /> {avatar ? "Ganti Foto" : "Pilih Foto"}
          <input id={id} name="avatar" type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange} disabled={pending}
            aria-label="Pilih foto profil" aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
            aria-invalid={error ? true : undefined} className="sr-only" />
        </Button>
      </div>

      {preview ? (
        <div className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={pending}>{pending ? "Menyimpan…" : "Simpan Foto"}</Button>
          <Button variant="secondary" className="w-full" onClick={onCancel} disabled={pending}>Batal</Button>
        </div>
      ) : avatar ? (
        <ConfirmActionButton action={removeAvatarAction} title="Hapus foto profil?" message="Tampilan kembali ke inisial nama."
          confirmLabel="Ya, hapus" successToast="foto-profil-dihapus" size="md" triggerVariant="secondary" className="w-full text-red-600!">
          <Trash2 size={16} aria-hidden="true" /> Hapus Foto
        </ConfirmActionButton>
      ) : null}

      <p id={`${id}-hint`} className="text-center text-xs text-slate-500">JPG, PNG, atau WEBP, maks. 2 MB</p>
      {error ? <p id={`${id}-error`} role="alert" className="text-center text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
