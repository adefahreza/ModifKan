import { PackageOpen } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { ORDER_STATUSES, STATUS_LABELS, isOrderStatus } from "@/lib/order-rules";
import FilterChips from "@/components/dashboard/FilterChips";
import OrdersTable from "@/components/orders/OrdersTable";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pesanan masuk — ModifKan" };

export default async function SellerOrdersPage({ searchParams }) {
  const user = await requireApprovedSeller();
  const sp = await searchParams;
  const status = isOrderStatus(sp.status) ? sp.status : null;

  const [{ rows: orders }, { rows: counts }] = await Promise.all([
    query("orders/list-by-store", [user.storeId, status, null]),
    query("orders/count-by-status", [user.storeId]),
  ]);
  const countOf = Object.fromEntries(counts.map((c) => [c.status, c.count]));
  const total = counts.reduce((sum, c) => sum + c.count, 0);
  const options = [
    { value: "", label: "Semua", count: total },
    ...ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s], count: countOf[s] ?? 0 })),
  ];

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase">Pesanan masuk</h1>
      <FilterChips options={options} param="status" current={status ?? ""} basePath="/seller/orders" />
      {orders.length === 0 ? (
        <EmptyState icon={PackageOpen} title="Belum ada pesanan" description={status ? "Tidak ada pesanan dengan status ini." : undefined} />
      ) : (
        <OrdersTable orders={orders} hrefBase="/seller/orders" columns={{ buyer: true }} />
      )}
    </div>
  );
}
