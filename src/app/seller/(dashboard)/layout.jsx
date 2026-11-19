import { requireApprovedSeller } from "@/lib/auth";
import { query } from "@/lib/db";
import DashboardShell from "@/components/dashboard/DashboardShell";

const ITEMS = [
  { href: "/seller", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/seller/store", label: "Toko Saya", icon: "Store" },
  { href: "/seller/products", label: "Produk", icon: "Package" },
  { href: "/seller/orders", label: "Pesanan", icon: "ClipboardList" },
];

export default async function SellerLayout({ children }) {
  const user = await requireApprovedSeller();
  const { rows } = await query("orders/count-by-status", [user.storeId]);
  const waiting = rows.find((r) => r.status === "menunggu_pembayaran")?.count ?? 0;
  const items = ITEMS.map((i) => (i.href === "/seller/orders" && waiting > 0 ? { ...i, badge: waiting } : i));
  return (
    <DashboardShell title="SELLER CENTER" items={items} user={{ name: user.name }}>
      {children}
    </DashboardShell>
  );
}
