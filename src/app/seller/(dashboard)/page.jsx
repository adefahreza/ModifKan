import { AlertTriangle, ClipboardList, Package } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { ORDER_STATUSES, STATUS_LABELS } from "@/lib/order-rules";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/orders/OrdersTable";

export const dynamic = "force-dynamic";

export const metadata = { title: "Seller Center — ModifKan" };

export default async function SellerHome() {
  const user = await requireApprovedSeller();
  const [{ rows }, { rows: counts }, { rows: latest }] = await Promise.all([
    query("stores/seller-stats", [user.storeId]),
    query("orders/count-by-status", [user.storeId]),
    query("orders/list-by-store", [user.storeId, null, 5]),
  ]);
  const countOf = Object.fromEntries(counts.map((c) => [c.status, c.count]));

  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Ringkasan</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <StatCard label="Produk" value={rows[0].product_count} icon={Package} href="/seller/products" />
        <StatCard label="Stok habis" value={rows[0].out_of_stock_count} icon={AlertTriangle} href="/seller/products" />
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold uppercase">Pesanan</h2>
      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        {ORDER_STATUSES.map((s) => (
          <StatCard key={s} label={STATUS_LABELS[s]} value={countOf[s] ?? 0} icon={ClipboardList} href={`/seller/orders?status=${s}`} />
        ))}
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold uppercase">Pesanan terbaru</h2>
      <div className="mt-3">
        {latest.length === 0 ? (
          <p className="rounded-xl bg-white p-8 text-center text-slate-600 ring-1 ring-slate-200">Belum ada pesanan</p>
        ) : (
          <OrdersTable orders={latest} hrefBase="/seller/orders" columns={{ buyer: true }} />
        )}
      </div>
    </>
  );
}
