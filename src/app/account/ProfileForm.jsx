"use client";

import { startTransition, useActionState, useEffect, useId } from "react";
import { Pencil } from "lucide-react";
import { updateProfileAction } from "@/lib/actions/profile";
import Button from "@/components/ui/Button";
import { showToast } from "@/lib/toast-client";

const inputClass = (error) =>
  `block min-h-11 w-full rounded-lg bg-white px-3 text-base text-slate-900 ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${error ? "ring-red-500" : "ring-slate-300"}`;

// Satu baris: label di kiri, nilai (mode lihat) atau kotak isian (mode edit) di kanan.
function Row({ label, name, type = "text", value, editing, error, autoComplete, autoFocus }) {
  const id = useId();
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-4">
      {editing
        ? <label htmlFor={id} className="text-sm text-slate-600">{label}</label>
        : <span className="text-sm text-slate-600">{label}</span>}
      {editing ? (
        <div>
          <input id={id} name={name} type={type} defaultValue={value} autoComplete={autoComplete} autoFocus={autoFocus}
            aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className={inputClass(error)} />
          {error ? <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p> : null}
        </div>
      ) : (
        <span className="min-h-11 break-all py-2.5 text-slate-900 sm:py-0 sm:leading-[2.75rem]">{value}</span>
      )}
    </div>
  );
}

// Mode lihat menampilkan data; tombol Edit di pojok kanan bawah mengubah baris jadi kotak isian.
// Komponen dipasang ulang (key) tiap masuk mode edit, jadi error lama tidak terbawa.
export default function ProfileForm({ user, editing, onEdit, onDone }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {
    errors: {}, values: { name: user.name, email: user.email, phone: user.phone },
  });
  useEffect(() => {
    if (!state.savedAt) return;
    showToast("profil-disimpan");
    onDone();
  }, [state.savedAt, onDone]);

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  const v = editing ? state.values : user;
  return (
    <form onSubmit={onSubmit} noValidate className="flex h-full flex-col">
      {state.message ? <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <h2 className="font-bold text-slate-700">Ubah Biodata Diri</h2>
      <div className="mt-3 space-y-2">
        <Row label="Nama" name="name" value={v.name} editing={editing} error={state.errors.name} autoComplete="name" autoFocus />
        <Row label="Bergabung" value={user.joined} />
      </div>
      <h2 className="mt-6 font-bold text-slate-700">Ubah Kontak</h2>
      <div className="mt-3 space-y-2">
        <Row label="Email" name="email" type="email" value={v.email} editing={editing} error={state.errors.email} autoComplete="email" />
        <Row label="Nomor HP" name="phone" type="tel" value={v.phone} editing={editing} error={state.errors.phone} autoComplete="tel" />
      </div>
      <div className="mt-auto flex justify-end gap-2 pt-6">
        {editing ? (
          <>
            <Button variant="secondary" onClick={onDone} disabled={pending}>Batal</Button>
            <Button type="submit" disabled={pending}>{pending ? "Menyimpan…" : "Simpan"}</Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onEdit}><Pencil size={16} aria-hidden="true" /> Edit</Button>
        )}
      </div>
    </form>
  );
}
