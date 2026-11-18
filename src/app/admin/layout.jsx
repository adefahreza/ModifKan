import { requireRole } from "@/lib/auth";
import { query } from "@/lib/db";
import DashboardShell from "@/components/dashboard/DashboardShell";

const ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: "LayoutDashboard" },
  { href: "/admin/sellers", label: "Verifikasi Seller", icon: "BadgeCheck" },
  { href: "/admin/users", label: "Pengguna", icon: "Users" },
  { href: "/admin/categories", label: "Kategori", icon: "Tags" },
  { href: "/admin/products", label: "Moderasi Produk", icon: "Package" },
  { href: "/admin/orders", label: "Pesanan", icon: "ClipboardList" },
];

export default async function AdminLayout({ children }) {
  const user = await requireRole("admin");
  const { rows } = await query("admin/stats");
  const pending = rows[0].sellers_pending;
  const items = ITEMS.map((i) => (i.href === "/admin/sellers" && pending > 0 ? { ...i, badge: pending } : i));
  return (
    <DashboardShell title="ADMIN" items={items} user={{ name: user.name }}>
      {children}
    </DashboardShell>
  );
}
