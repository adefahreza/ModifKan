"use client";

import { deleteRejectedAccountAction } from "@/lib/actions/auth";
import ConfirmActionButton from "@/components/ConfirmActionButton";

export default function DeleteAccountButton() {
  return (
    <ConfirmActionButton action={deleteRejectedAccountAction} title="Hapus akun?" size="md"
      message="Akun dan toko akan dihapus permanen. Lanjutkan?" confirmLabel="Ya, hapus">Delete Account</ConfirmActionButton>
  );
}
