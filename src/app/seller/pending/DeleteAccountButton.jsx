"use client";

import { useState, useTransition } from "react";
import { deleteRejectedAccountAction } from "@/lib/actions/auth";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteRejectedAccountAction();
      if (result?.message) setMessage(result.message);
    });
  }

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete Account</Button>
      <Modal open={open} onClose={() => !pending && setOpen(false)} title="Hapus akun?">
        <p className="text-sm text-slate-600">Akun dan toko akan dihapus permanen. Lanjutkan?</p>
        {message ? <p role="alert" className="mt-3 text-sm text-red-600">{message}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={pending}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={pending}>{pending ? "Menghapus…" : "Ya, hapus"}</Button>
        </div>
      </Modal>
    </>
  );
}
