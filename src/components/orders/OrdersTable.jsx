import Link from "next/link";
import { formatDate, formatOrderNumber, formatRupiah } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

// columns: { buyer?, store? } — kolom pihak yang ditampilkan. Nama NULL berarti akun/toko sudah dihapus.
export default function OrdersTable({ orders, hrefBase, columns = {} }) {
  const parties = [
    columns.buyer && { key: "buyer", label: "Pembeli", value: (o) => o.buyer_name ?? "Akun telah dihapus" },
    columns.store && { key: "store", label: "Toko", value: (o) => o.store_name ?? "Toko telah dihapus" },
  ].filter(Boolean);

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200 md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              {["Nomor", "Tanggal", ...parties.map((p) => p.label), "Item", "Total", "Status"].map((h) => (
                <th key={h} scope="col" className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`${hrefBase}/${o.id}`} className="font-semibold text-red-600 hover:underline">{formatOrderNumber(o.id)}</Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3">{formatDate(o.created_at)}</td>
                {parties.map((p) => <td key={p.key} className="px-4 py-3">{p.value(o)}</td>)}
                <td className="max-w-xs px-4 py-3"><span className="line-clamp-2">{o.item_summary}</span></td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold">{formatRupiah(o.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {orders.map((o) => (
          <li key={o.id}>
            <Link href={`${hrefBase}/${o.id}`} className="block rounded-xl bg-white p-4 ring-1 ring-slate-200 hover:ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-900">{formatOrderNumber(o.id)}</p>
                  <p className="text-xs text-slate-500">{[...parties.map((p) => p.value(o)), formatDate(o.created_at)].join(" · ")}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-slate-700">{o.item_summary}</p>
              <p className="mt-2 font-display text-xl font-bold">{formatRupiah(o.total)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
