"use client";

import { useId, useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/lib/toast-client";

const MAX = 500;

// Tombol + modal berisi kolom alasan wajib (Reject / Tangguhkan). `action(reason)` mengembalikan { errors?, message? }.
export default function ReasonModal({ triggerLabel, triggerVariant = "secondary", title, label, confirmLabel, action, successToast }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function show() {
    setReason("");
    setError("");
    setOpen(true);
  }

  function submit(event) {
    event.preventDefault();
    startTransition(async () => {
      const result = await action(reason);
      const message = result?.errors?.reason ?? result?.message;
      if (message) setError(message);
      else {
        setOpen(false);
        if (successToast) showToast(successToast);
      }
    });
  }

  return (
    <>
      <Button size="sm" variant={triggerVariant} onClick={show}>{triggerLabel}</Button>
      <Modal open={open} onClose={() => !pending && setOpen(false)} title={title}>
        <form onSubmit={submit} noValidate>
          <p className="text-sm text-slate-600">Alasan akan ditampilkan ke seller.</p>
          <label htmlFor={id} className="mb-1 mt-4 block text-sm font-medium text-slate-700">{label}</label>
          <textarea id={id} rows={4} maxLength={MAX} value={reason} onChange={(e) => { setReason(e.target.value); setError(""); }}
            aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
            className={`block w-full rounded-lg bg-white px-3 py-2 text-base ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${error ? "ring-red-500" : "ring-slate-300"}`} />
          <div className="mt-1 flex justify-between gap-3 text-xs">
            {error ? <p id={`${id}-error`} role="alert" className="text-sm text-red-600">{error}</p> : <span className="text-slate-500">Minimal 10 karakter.</span>}
            <span className="shrink-0 text-slate-500">{reason.trim().length}/{MAX}</span>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={pending}>Batal</Button>
            <Button type="submit" variant="danger" disabled={pending}>{pending ? "Memproses…" : confirmLabel}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
