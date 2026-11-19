import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderItemsList from "@/components/orders/OrderItemsList";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detail pesanan — ModifKan" };

// Admin hanya melihat: tanpa OrderActions.
export default async function AdminOrderDetailPage({ params }) {
  await requireRole("admin");
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  const { rows } = await query("admin/find-order", [Number(id)]);
  const order = rows[0];
  if (!order) notFound();
  const { rows: items } = await query("orders/items", [order.id]);

  const buyer = order.buyer_name == null
    ? { label: "Pembeli", name: "Akun telah dihapus" }
    : { label: "Pembeli", name: order.buyer_name, phone: order.buyer_phone };

  return (
    <div className="space-y-4">
      <Link href="/admin/orders" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-600 hover:text-red-600">
        <ArrowLeft size={16} aria-hidden="true" /> Kembali ke pesanan
      </Link>
      <OrderSummary order={order} party={buyer} />
      <p className="rounded-xl bg-white px-4 py-3 text-sm ring-1 ring-slate-200">
        <span className="text-slate-500">Toko: </span>
        <span className="font-semibold text-slate-900">{order.store_name ?? "Toko telah dihapus"}</span>
      </p>
      <OrderTimeline status={order.status} />
      <OrderItemsList items={items} />
    </div>
  );
}
