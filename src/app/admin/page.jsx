import Link from "next/link";
import { BadgeCheck, ClipboardList, Package, PackageOpen, PauseCircle, ShoppingBag, UserCheck, UserX } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/orders/OrdersTable";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — ModifKan" };

function PanelHeader({ id, title, href, linkLabel }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 id={id} className="font-display text-2xl font-bold uppercase">{title}</h2>
      <Link href={href} className="inline-flex min-h-11 items-center text-sm font-semibold text-red-600 hover:underline">{linkLabel}</Link>
    </div>
  );
}

export default async function AdminHome() {
  await requireRole("admin"); // wajib di halaman: layout bisa dilewati lewat request RSC
  const [{ rows }, { rows: pending }, { rows: latest }] = await Promise.all([
    query("admin/stats"),
    query("stores/list-by-status", ["pending"]),
    query("admin/list-orders", [null, 5]),
  ]);
  const s = rows[0];
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Ringkasan</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Buyer" value={s.buyers} icon={ShoppingBag} />
        <StatCard label="Seller pending" value={s.sellers_pending} icon={BadgeCheck} href="/admin/sellers" />
        <StatCard label="Seller approved" value={s.sellers_approved} icon={UserCheck} />
        <StatCard label="Seller rejected" value={s.sellers_rejected} icon={UserX} />
        <StatCard label="Seller ditangguhkan" value={s.sellers_suspended} icon={PauseCircle} href="/admin/sellers?status=suspended" />
        <StatCard label="Produk" value={s.products} icon={Package} />
        <StatCard label="Pesanan" value={s.orders} icon={ClipboardList} />
      </div>

      <section aria-labelledby="admin-pending-title" className="mt-8">
        <PanelHeader id="admin-pending-title" title="Menunggu verifikasi" href="/admin/sellers" linkLabel={`Lihat semua (${pending.length})`} />
        {pending.length === 0 ? (
          <EmptyState icon={BadgeCheck} title="Semua seller sudah diverifikasi" description="Pendaftaran seller baru akan muncul di sini." />
        ) : (
          <ul className="divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
            {pending.slice(0, 5).map((st) => (
              <li key={st.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{st.name}</p>
                  <p className="break-all text-sm text-slate-500">{st.owner_name} · {st.email}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>Daftar {formatDate(st.created_at)}</span>
                  <Badge tone="amber">Pending</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="admin-latest-title" className="mt-8">
        <PanelHeader id="admin-latest-title" title="Pesanan terbaru" href="/admin/orders" linkLabel="Lihat semua" />
        {latest.length === 0 ? (
          <EmptyState icon={PackageOpen} title="Belum ada pesanan" />
        ) : (
          <OrdersTable orders={latest} hrefBase="/admin/orders" columns={{ buyer: true, store: true }} />
        )}
      </section>
    </>
  );
}
