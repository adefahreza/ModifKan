import { AlertTriangle, Package } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import StatCard from "@/components/dashboard/StatCard";

export const metadata = { title: "Seller Center — ModifKan" };

export default async function SellerHome() {
  const user = await requireApprovedSeller();
  const { rows } = await query("stores/seller-stats", [user.storeId]);
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Ringkasan</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <StatCard label="Produk" value={rows[0].product_count} icon={Package} href="/seller/products" />
        <StatCard label="Stok habis" value={rows[0].out_of_stock_count} icon={AlertTriangle} href="/seller/products" />
      </div>
    </>
  );
}
