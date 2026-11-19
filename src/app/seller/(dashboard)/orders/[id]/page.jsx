import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { ORDER_ACTIONS, availableActions } from "@/lib/order-rules";
import { sellerOrderAction } from "@/lib/actions/orders";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderItemsList from "@/components/orders/OrderItemsList";
import OrderActions from "@/components/orders/OrderActions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Detail pesanan — ModifKan" };

export default async function SellerOrderDetailPage({ params }) {
  const user = await requireApprovedSeller();
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  const { rows } = await query("orders/find-for-store", [Number(id), user.storeId]);
  const order = rows[0];
  if (!order) notFound();

  const { rows: items } = await query("orders/items", [order.id]);
  const actions = availableActions(order.status, "seller").map((name) => ({
    name,
    label: ORDER_ACTIONS[name].label,
    run: sellerOrderAction.bind(null, order.id, name),
  }));
  const party = order.buyer_name == null
    ? { label: "Pembeli", name: "Akun telah dihapus" }
    : { label: "Pembeli", name: order.buyer_name, phone: order.buyer_phone };

  return (
    <div className="space-y-4">
      <Link href="/seller/orders" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-600 hover:text-red-600">
        <ArrowLeft size={16} aria-hidden="true" /> Kembali ke pesanan
      </Link>
      <OrderSummary order={order} party={party} />
      <OrderTimeline status={order.status} />
      <OrderItemsList items={items} />
      <OrderActions actions={actions} />
    </div>
  );
}
