"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import { showToast } from "@/lib/toast-client";

// actions: [{ name, label, run }] — run adalah server action yang sudah di-bind (mengembalikan { message? }).
export default function OrderActions({ actions }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const [cancelling, setCancelling] = useState(false);
  const busy = pending || cancelling;

  // Setelah gagal, halaman di-revalidate dan tombol bisa hilang; pesan tetap ditampilkan di sini.
  if (actions.length === 0 && !error) return null;

  async function runCancel(run) {
    setError("");
    setCancelling(true);
    try {
      const result = await run();
      if (result?.message) setError(result.message);
      else showToast("status-diperbarui");
      return result;
    } finally {
      setCancelling(false);
    }
  }

  function trigger(run) {
    setError("");
    startTransition(async () => {
      const result = await run();
      if (result?.message) setError(result.message);
      else showToast("status-diperbarui");
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {actions.map((a) =>
          a.name === "batalkan" ? (
            <ConfirmActionButton key={a.name} action={() => runCancel(a.run)} title="Batalkan pesanan?" size="md" disabled={pending}
              message="Pesanan akan dibatalkan dan stok dikembalikan." confirmLabel="Ya, batalkan">{a.label}</ConfirmActionButton>
          ) : (
            <Button key={a.name} onClick={() => trigger(a.run)} disabled={busy}>{pending ? "Memproses…" : a.label}</Button>
          ),
        )}
      </div>
      {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
