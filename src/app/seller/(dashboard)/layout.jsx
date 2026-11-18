import { requireApprovedSeller } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";

const ITEMS = [
  { href: "/seller", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/seller/store", label: "Toko Saya", icon: "Store" },
  { href: "/seller/products", label: "Produk", icon: "Package" },
  { href: "/seller/orders", label: "Pesanan", icon: "ClipboardList" },
];

export default async function SellerLayout({ children }) {
  const user = await requireApprovedSeller();
  return (
    <DashboardShell title="SELLER CENTER" items={ITEMS} user={{ name: user.name }}>
      {children}
    </DashboardShell>
  );
}
