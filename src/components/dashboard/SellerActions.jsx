"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import ReasonModal from "@/components/dashboard/ReasonModal";
import { approveSellerAction, rejectSellerAction, suspendSellerAction, reactivateSellerAction } from "@/lib/actions/stores";
import { showToast } from "@/lib/toast-client";

// Aksi admin sesuai status toko: pending (Approve/Reject), approved (Tangguhkan), suspended (Aktifkan kembali).
export default function SellerActions({ storeId, storeName, status }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function approve() {
    startTransition(async () => {
      const result = await approveSellerAction(storeId);
      setMessage(result?.message ?? "");
      if (!result?.message) showToast("seller-disetujui");
    });
  }

  if (status === "pending") {
    return (
      <div>
        <div className="flex gap-2">
          <Button size="sm" onClick={approve} disabled={pending}>Approve</Button>
          <ReasonModal triggerLabel="Reject" title={`Tolak ${storeName}?`} label="Alasan penolakan" confirmLabel="Ya, tolak"
            action={(reason) => rejectSellerAction(storeId, reason)} successToast="seller-ditolak" />
        </div>
        {message ? <p role="alert" className="mt-1 text-xs text-red-600">{message}</p> : null}
      </div>
    );
  }
  if (status === "approved") {
    return (
      <ReasonModal triggerLabel="Tangguhkan" title={`Tangguhkan ${storeName}?`} label="Alasan penangguhan" confirmLabel="Ya, tangguhkan"
        action={(reason) => suspendSellerAction(storeId, reason)} successToast="seller-ditangguhkan" />
    );
  }
  if (status === "suspended") {
    return (
      <ConfirmActionButton action={reactivateSellerAction.bind(null, storeId)} title="Aktifkan kembali seller?" variant="dark"
        message={`${storeName} bisa berjualan lagi dan produknya kembali tampil di katalog.`} confirmLabel="Ya, aktifkan" successToast="seller-diaktifkan">
        Aktifkan kembali
      </ConfirmActionButton>
    );
  }
  return null;
}
