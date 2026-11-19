import { PackageOpen } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ORDER_STATUSES, STATUS_LABELS, isOrderStatus } from "@/lib/order-rules";
import FilterChips from "@/components/dashboard/FilterChips";
import OrdersTable from "@/components/orders/OrdersTable";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pesanan — ModifKan" };

export default async function AdminOrdersPage({ searchParams }) {
  await requireRole("admin");
  const sp = await searchParams;
  const status = isOrderStatus(sp.status) ? sp.status : null;
  const { rows: orders } = await query("admin/list-orders", [status]);
  const options = [{ value: "", label: "Semua" }, ...ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase">Pesanan</h1>
      <FilterChips options={options} param="status" current={status ?? ""} basePath="/admin/orders" />
      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-14 text-center ring-1 ring-slate-200">
          <PackageOpen size={40} className="text-slate-400" aria-hidden="true" />
          <p className="font-semibold text-slate-900">Belum ada pesanan</p>
        </div>
      ) : (
        <OrdersTable orders={orders} hrefBase="/admin/orders" columns={{ buyer: true, store: true }} />
      )}
    </div>
  );
}
