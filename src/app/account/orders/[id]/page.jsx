import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { ORDER_ACTIONS, availableActions } from "@/lib/order-rules";
import { formatOrderNumber } from "@/lib/format";
import { buyerOrderAction } from "@/lib/actions/orders";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderItemsList from "@/components/orders/OrderItemsList";
import OrderActions from "@/components/orders/OrderActions";
import ReviewForm from "@/components/orders/ReviewForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return { title: /^\d{1,9}$/.test(id) ? `Pesanan ${formatOrderNumber(id)} — ModifKan` : "Pesanan — ModifKan" };
}

export default async function BuyerOrderDetailPage({ params }) {
  const user = await requireRole("buyer");
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();

  const { rows } = await query("orders/find-for-buyer", [Number(id), user.id]);
  const order = rows[0];
  if (!order) notFound();

  const { rows: items } = await query("orders/items", [order.id]);
  const actions = availableActions(order.status, "buyer").map((name) => ({
    name,
    label: ORDER_ACTIONS[name].label,
    run: buyerOrderAction.bind(null, order.id, name),
  }));

  const renderReview = (item) => {
    if (item.reviewed) return <p className="text-sm font-semibold text-emerald-700">Sudah diulas</p>;
    if (item.product_id == null) return <p className="text-sm text-slate-500">Produk sudah dihapus</p>;
    return <ReviewForm orderItemId={item.id} />;
  };

  return (
    <div className="space-y-4">
      <Link href="/account/orders" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-slate-600 hover:text-red-600">
        <ArrowLeft size={16} aria-hidden="true" /> Kembali ke pesanan
      </Link>
      <OrderSummary order={order} party={{ label: "Toko", name: order.store_name ?? "Toko telah dihapus" }} />
      <OrderTimeline status={order.status} />
      <OrderItemsList items={items} renderItemExtra={order.status === "selesai" ? renderReview : undefined} />
      <OrderActions actions={actions} />
    </div>
  );
}
