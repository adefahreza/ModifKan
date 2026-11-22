import { PackageOpen } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
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
        <EmptyState icon={PackageOpen} title="Belum ada pesanan" description={status ? "Tidak ada pesanan dengan status ini." : undefined} />
      ) : (
        <OrdersTable orders={orders} hrefBase="/admin/orders" columns={{ buyer: true, store: true }} />
      )}
    </div>
  );
}
