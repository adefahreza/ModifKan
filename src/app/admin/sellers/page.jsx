import { query } from "@/lib/db";
import { BadgeCheck } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import FilterChips from "@/components/dashboard/FilterChips";
import SellerActions from "@/components/dashboard/SellerActions";

export const metadata = { title: "Verifikasi Seller — ModifKan" };

const STATUSES = ["pending", "approved", "rejected"];
const LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" };
const TONE = { pending: "amber", approved: "emerald", rejected: "red" };

export default async function SellersPage({ searchParams }) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status) ? sp.status : "pending";
  const [{ rows }, { rows: stats }] = await Promise.all([
    query("stores/list-by-status", [status]),
    query("admin/stats"),
  ]);
  const counts = { pending: stats[0].sellers_pending, approved: stats[0].sellers_approved, rejected: stats[0].sellers_rejected };
  const options = STATUSES.map((v) => ({ value: v, label: LABEL[v], count: counts[v] }));

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
                  {["Toko", "Pemilik", "Email", "HP", "Daftar", "Status", ""].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-semibold">{r.name}</td>
                    <td className="px-4 py-3">{r.owner_name}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3"><Badge tone={TONE[r.status]}>{LABEL[r.status]}</Badge></td>
                    <td className="px-4 py-3">{r.status === "pending" ? <SellerActions storeId={r.id} /> : null}</td>
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
                <p className="mt-1 text-sm text-slate-600">{r.owner_name} · {r.email}</p>
                <p className="text-sm text-slate-600">{r.phone} · {formatDate(r.created_at)}</p>
                {r.status === "pending" ? <div className="mt-3"><SellerActions storeId={r.id} /></div> : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
