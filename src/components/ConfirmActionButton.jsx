"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { showToast } from "@/lib/toast-client";

export default function ConfirmActionButton({ action, title, message, confirmLabel = "Ya", successToast, variant = "danger", size = "sm", disabled = false, triggerVariant = variant, className = "", children }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      const result = await action();
      if (result?.message) setError(result.message);
      else {
        setOpen(false);
        if (successToast) showToast(successToast);
      }
    });
  }

  return (
    <>
      <Button variant={triggerVariant} size={size} className={className} disabled={disabled} onClick={() => { setError(""); setOpen(true); }}>{children}</Button>
      <Modal open={open} onClose={() => !pending && setOpen(false)} title={title}>
        <p className="text-sm text-slate-600">{message}</p>
        {error ? <p role="alert" className="mt-3 text-sm text-red-600">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>Batal</Button>
          <Button variant={variant} onClick={run} disabled={pending}>{pending ? "Memproses…" : confirmLabel}</Button>
        </div>
      </Modal>
    </>
  );
}
