import Link from "next/link";
import { CheckCircle2, PackageOpen } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ORDER_STATUSES, STATUS_LABELS, isOrderStatus } from "@/lib/order-rules";
import { formatDate, formatOrderNumber, formatRupiah } from "@/lib/format";
import FilterChips from "@/components/dashboard/FilterChips";
import StatusBadge from "@/components/StatusBadge";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pesanan saya — ModifKan" };

export default async function OrdersPage({ searchParams }) {
  const user = await requireRole("buyer");
  const sp = await searchParams;
  const status = isOrderStatus(sp.status) ? sp.status : null;
  const created = typeof sp.created === "string" && /^[1-9]\d{0,2}$/.test(sp.created) ? Number(sp.created) : null;

  const { rows: orders } = await query("orders/list-by-buyer", [user.id, status]);
  const options = [{ value: "", label: "Semua" }, ...ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Pesanan saya</h1>
      {created ? (
        <p role="status" className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          <CheckCircle2 size={18} aria-hidden="true" /> {created} pesanan berhasil dibuat
        </p>
      ) : null}
      <FilterChips options={options} param="status" current={status ?? ""} basePath="/account/orders" />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
          <PackageOpen size={40} className="text-slate-400" aria-hidden="true" />
          <p className="font-semibold text-slate-900">Belum ada pesanan</p>
          <Button as={Link} href="/products">Mulai belanja</Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{formatOrderNumber(o.id)}</p>
                  <p className="text-xs text-slate-500">{o.store_name ?? "Toko telah dihapus"} · {formatDate(o.created_at)}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-700">{o.item_summary}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="font-display text-xl font-bold">{formatRupiah(o.total)}</p>
                <Link href={`/account/orders/${o.id}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-red-600 hover:underline">Lihat detail</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
