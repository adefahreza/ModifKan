import { redirect } from "next/navigation";
import { Clock, MessageCircle, PauseCircle, Phone, XCircle } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { formatDate, waLink } from "@/lib/format";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";
import DeleteAccountButton from "./DeleteAccountButton";

export const metadata = { title: "Status Toko — ModifKan" };

const VIEW = {
  pending: {
    icon: Clock, iconClass: "text-amber-500", title: "Akun Anda sedang ditinjau.",
    text: "Admin sedang memeriksa pendaftaran dan foto KTP Anda. Anda dapat masuk lagi nanti.",
  },
  rejected: {
    icon: XCircle, iconClass: "text-red-600", title: "Pendaftaran ditolak",
    text: "Maaf, pendaftaran toko Anda tidak disetujui admin. Anda dapat menghapus akun ini dan mendaftar ulang dengan data yang benar.",
    reasonLabel: "Alasan penolakan", reasonClass: "bg-red-50 ring-red-200", reasonLabelClass: "text-red-800", reasonTextClass: "text-red-900",
  },
  suspended: {
    icon: PauseCircle, iconClass: "text-orange-600", title: "Akun toko ditangguhkan",
    text: "Toko dan produk Anda disembunyikan sementara dari pembeli.",
    reasonLabel: "Alasan penangguhan", reasonClass: "bg-orange-50 ring-orange-200", reasonLabelClass: "text-orange-800", reasonTextClass: "text-orange-900",
  },
};

export default async function SellerPendingPage() {
  const user = await requireRole("seller");
  if (user.storeStatus === "approved") redirect("/seller");
  const view = VIEW[user.storeStatus] ?? VIEW.pending;
  const Icon = view.icon;

  // Kontak CS = nomor HP admin (diatur admin di halaman Profil Saya).
  let contact = null;
  if (user.storeStatus === "suspended") {
    const { rows } = await query("users/find-admin-contact");
    const phone = rows[0]?.phone;
    const href = waLink(phone);
    if (href) contact = { phone, href };
  }

  return (
    <div className="stripe-red flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-10">
      <Logo size="lg" className="mb-6" />
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl ring-1 ring-slate-200 sm:p-8">
        <Icon size={48} className={`mx-auto ${view.iconClass}`} aria-hidden="true" />
        <h1 className="mt-4 font-display text-3xl font-bold uppercase">{view.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{view.text}</p>

        {view.reasonLabel && user.storeReason ? (
          <div className={`mt-5 rounded-lg p-4 text-left ring-1 ${view.reasonClass}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide ${view.reasonLabelClass}`}>{view.reasonLabel}</p>
            <p className={`mt-1 whitespace-pre-line break-words text-sm ${view.reasonTextClass}`}>{user.storeReason}</p>
          </div>
        ) : null}

        {contact ? (
          <div className="mt-3 rounded-lg bg-slate-50 p-4 text-left">
            <p className="text-sm text-slate-600">Hubungi Customer Service ModifKan untuk menyelesaikan penangguhan:</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-slate-900"><Phone size={16} aria-hidden="true" /> {contact.phone}</p>
          </div>
        ) : null}

        <dl className="mt-5 space-y-1 rounded-lg bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Nama toko</dt><dd className="font-semibold">{user.storeName}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-slate-500">Tanggal daftar</dt><dd className="font-semibold">{formatDate(user.storeCreatedAt)}</dd></div>
        </dl>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {contact ? (
            <Button as="a" href={contact.href} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <MessageCircle size={16} aria-hidden="true" /> Chat WhatsApp
            </Button>
          ) : null}
          <form action={logoutAction}><Button type="submit" variant="dark" className="w-full">Keluar</Button></form>
          {user.storeStatus === "rejected" ? <DeleteAccountButton /> : null}
        </div>
      </div>
    </div>
  );
}
