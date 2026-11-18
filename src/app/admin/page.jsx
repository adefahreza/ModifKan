import { BadgeCheck, ClipboardList, Package, ShoppingBag, UserCheck, UserX } from "lucide-react";
import { query } from "@/lib/db";
import StatCard from "@/components/dashboard/StatCard";

export const metadata = { title: "Admin — ModifKan" };

export default async function AdminHome() {
  const { rows } = await query("admin/stats");
  const s = rows[0];
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Ringkasan</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Buyer" value={s.buyers} icon={ShoppingBag} />
        <StatCard label="Seller pending" value={s.sellers_pending} icon={BadgeCheck} href="/admin/sellers" />
        <StatCard label="Seller approved" value={s.sellers_approved} icon={UserCheck} />
        <StatCard label="Seller rejected" value={s.sellers_rejected} icon={UserX} />
        <StatCard label="Produk" value={s.products} icon={Package} />
        <StatCard label="Pesanan" value={s.orders} icon={ClipboardList} />
      </div>
    </>
  );
}
