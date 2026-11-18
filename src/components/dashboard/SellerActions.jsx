"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import { approveSellerAction, rejectSellerAction } from "@/lib/actions/stores";

export default function SellerActions({ storeId }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      const result = await approveSellerAction(storeId);
      setMessage(result?.message ?? "");
    });
  }

  return (
    <div>
      <div className="flex gap-2">
        <Button size="sm" onClick={approve} disabled={pending}>Approve</Button>
        <ConfirmActionButton action={rejectSellerAction.bind(null, storeId)} title="Tolak seller?"
          message="Seller akan ditolak dan tidak bisa berjualan." confirmLabel="Ya, tolak">Reject</ConfirmActionButton>
      </div>
      {message ? <p role="alert" className="mt-1 text-xs text-red-600">{message}</p> : null}
    </div>
  );
}
