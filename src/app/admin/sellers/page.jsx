import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { BadgeCheck } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import FilterChips from "@/components/dashboard/FilterChips";
import SellerActions from "@/components/dashboard/SellerActions";
import KtpPreview from "@/components/dashboard/KtpPreview";

export const metadata = { title: "Verifikasi Seller — ModifKan" };

const STATUSES = ["pending", "approved", "suspended", "rejected"];
const LABEL = { pending: "Pending", approved: "Approved", suspended: "Ditangguhkan", rejected: "Rejected" };
const TONE = { pending: "amber", approved: "emerald", suspended: "orange", rejected: "red" };
// Tanggal yang relevan per tab: daftar (pending/approved) atau terakhir berubah status (ditangguhkan/ditolak).
const DATE_LABEL = { pending: "Daftar", approved: "Daftar", suspended: "Ditangguhkan", rejected: "Ditolak" };
const dateOf = (r) => (r.status === "suspended" || r.status === "rejected" ? r.updated_at : r.created_at);

export default async function SellersPage({ searchParams }) {
  await requireRole("admin"); // wajib di halaman: layout bisa dilewati lewat request RSC
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status) ? sp.status : "pending";
  const [{ rows }, { rows: stats }] = await Promise.all([
    query("stores/list-by-status", [status]),
    query("admin/stats"),
  ]);
  const s = stats[0];
  const counts = { pending: s.sellers_pending, approved: s.sellers_approved, suspended: s.sellers_suspended, rejected: s.sellers_rejected };
  const options = STATUSES.map((v) => ({ value: v, label: LABEL[v], count: counts[v] }));
  const showReason = status === "suspended" || status === "rejected";
  const showActions = status !== "rejected";

  const ktp = (r) => (
    <KtpPreview ktp={r.ktp_image} storeName={r.name} ownerName={r.owner_name} phone={r.phone}>
      {r.status === "pending" ? <SellerActions storeId={r.id} storeName={r.name} status={r.status} /> : null}
    </KtpPreview>
  );
  const actions = (r) => <SellerActions storeId={r.id} storeName={r.name} status={r.status} />;
  const headers = ["Toko", "Pemilik", "Kontak", DATE_LABEL[status], "KTP", ...(showReason ? ["Alasan"] : []), "Status", ...(showActions ? [""] : [])];

  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Verifikasi Seller</h1>
      <div className="mt-4"><FilterChips options={options} param="status" current={status} basePath="/admin/sellers" /></div>

      {rows.length === 0 ? (
        <EmptyState icon={BadgeCheck} title={`Tidak ada seller berstatus ${LABEL[status].toLowerCase()}`} className="mt-6" />
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  {headers.map((h, i) => <th key={`${h}-${i}`} scope="col" className="px-4 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3">{r.owner_name}</td>
                    <td className="px-4 py-3"><span className="break-all">{r.email}</span><br /><span className="text-slate-500">{r.phone}</span></td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(dateOf(r))}</td>
                    <td className="px-4 py-3">{ktp(r)}</td>
                    {showReason ? <td className="max-w-xs px-4 py-3 text-slate-600">{r.status_reason ?? "—"}</td> : null}
                    <td className="px-4 py-3"><Badge tone={TONE[r.status]}>{LABEL[r.status]}</Badge></td>
                    {showActions ? <td className="px-4 py-3">{actions(r)}</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-4 space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{r.name}</p>
                  <Badge tone={TONE[r.status]}>{LABEL[r.status]}</Badge>
                </div>
                <p className="mt-1 break-all text-sm text-slate-600">{r.owner_name} · {r.email}</p>
                <p className="text-sm text-slate-600">{r.phone} · {DATE_LABEL[status]} {formatDate(dateOf(r))}</p>
                {showReason && r.status_reason ? <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">Alasan: {r.status_reason}</p> : null}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {ktp(r)}
                  {showActions ? actions(r) : null}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
