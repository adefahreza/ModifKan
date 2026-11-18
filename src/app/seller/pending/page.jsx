import { redirect } from "next/navigation";
import { Clock, XCircle } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { formatDate } from "@/lib/format";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";
import DeleteAccountButton from "./DeleteAccountButton";

export const metadata = { title: "Status Toko — ModifKan" };

export default async function SellerPendingPage() {
  const user = await requireRole("seller");
  if (user.storeStatus === "approved") redirect("/seller");
  const rejected = user.storeStatus === "rejected";
  const Icon = rejected ? XCircle : Clock;

  return (
    <div className="stripe-red flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-10">
      <Logo size="lg" className="mb-6" />
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl ring-1 ring-slate-200 sm:p-8">
        <Icon size={48} className={`mx-auto ${rejected ? "text-red-600" : "text-amber-500"}`} aria-hidden="true" />
        <h1 className="mt-4 font-display text-3xl font-bold uppercase">
          {rejected ? "Pendaftaran ditolak" : "Akun Anda sedang ditinjau."}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {rejected
            ? "Maaf, pendaftaran toko Anda tidak disetujui admin. Anda dapat menghapus akun ini dan mendaftar ulang."
            : "Admin sedang memeriksa pendaftaran toko Anda. Anda dapat masuk lagi nanti."}
        </p>
        <dl className="mt-5 space-y-1 rounded-lg bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Nama toko</dt><dd className="font-semibold">{user.storeName}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Tanggal daftar</dt><dd className="font-semibold">{formatDate(user.storeCreatedAt)}</dd></div>
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <form action={logoutAction}><Button type="submit" variant="dark" className="w-full">Keluar</Button></form>
          {rejected ? <DeleteAccountButton /> : null}
        </div>
      </div>
    </div>
  );
}
