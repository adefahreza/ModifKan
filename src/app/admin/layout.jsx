import { requireRole } from "@/lib/auth";
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
  return (
    <DashboardShell title="ADMIN" items={ITEMS} user={{ name: user.name }}>
      {children}
    </DashboardShell>
  );
}
