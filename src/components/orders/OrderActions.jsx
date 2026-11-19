"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";

// actions: [{ name, label, run }] — run adalah server action yang sudah di-bind (mengembalikan { message? }).
export default function OrderActions({ actions }) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (actions.length === 0) return null;

  function trigger(run) {
    setError("");
    startTransition(async () => {
      const result = await run();
      if (result?.message) setError(result.message);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {actions.map((a) =>
          a.name === "batalkan" ? (
            <ConfirmActionButton key={a.name} action={a.run} title="Batalkan pesanan?" size="md"
              message="Pesanan akan dibatalkan dan stok dikembalikan." confirmLabel="Ya, batalkan">{a.label}</ConfirmActionButton>
          ) : (
            <Button key={a.name} onClick={() => trigger(a.run)} disabled={pending}>{pending ? "Memproses…" : a.label}</Button>
          ),
        )}
      </div>
      {error ? <p role="alert" className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
