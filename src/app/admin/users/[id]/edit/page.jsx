import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Mail, Phone, Store } from "lucide-react";
import { query } from "@/lib/db";
import { formatDate, formatRupiah } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import UserEditForm from "./UserEditForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Pengguna — ModifKan" };

const ROLE_TONE = { buyer: "blue", seller: "violet" };
const STORE_TONE = { pending: "amber", approved: "emerald", rejected: "red", suspended: "orange" };
const STORE_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected", suspended: "Ditangguhkan" };

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function Stat({ label, value, warn = false, wide = false }) {
  return (
    <div className={`rounded-lg p-3 ${warn ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-900"} ${wide ? "col-span-2" : ""}`}>
      <dt className={`text-xs ${warn ? "text-amber-800" : "text-slate-500"}`}>{label}</dt>
      <dd className="font-display text-2xl font-bold">{value}</dd>
    </div>
  );
}

function Summary({ user, s }) {
  if (user.role === "seller") {
    return (
      <>
        {s.store_name ? (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
            <Store size={16} aria-hidden="true" className="text-slate-500" /> {s.store_name}
            <Badge tone={STORE_TONE[s.store_status]}>{STORE_LABEL[s.store_status]}</Badge>
          </p>
        ) : null}
        <dl className="mt-3 grid grid-cols-2 gap-2">
          <Stat label="Produk" value={s.store_products} />
          <Stat label="Pesanan masuk" value={s.store_orders} />
          <Stat label="Pesanan berjalan" value={s.store_active} warn={s.store_active > 0} wide />
        </dl>
      </>
    );
  }
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2">
      <Stat label="Pesanan" value={s.buyer_orders} />
      <Stat label="Pesanan berjalan" value={s.buyer_active} warn={s.buyer_active > 0} />
      <Stat label="Total belanja (selesai)" value={formatRupiah(Number(s.buyer_spent))} wide />
    </dl>
  );
}

export default async function EditUserPage({ params }) {
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();
  const { rows } = await query("users/find-by-id", [Number(id)]);
  const user = rows[0];
  if (!user) notFound();
  const { rows: [summary] } = await query("users/admin-summary", [user.id]);

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/admin/users" className="hover:text-slate-900">Pengguna</Link> / <span aria-current="page" className="text-slate-900">Edit</span>
      </nav>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase">Edit Pengguna</h1>

      <section aria-labelledby="user-profile-title" className="stripe-red relative mt-5 overflow-hidden rounded-xl bg-slate-900 p-5 text-white sm:p-6">
        <div aria-hidden="true" className="absolute -right-12 -top-12 size-40 rounded-full border-[20px] border-slate-700/40" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <span aria-hidden="true" className="flex size-16 shrink-0 items-center justify-center rounded-full bg-red-600 font-display text-2xl font-bold sm:size-20 sm:text-3xl">{initials(user.name)}</span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 id="user-profile-title" className="break-words font-display text-3xl font-extrabold uppercase italic leading-none">{user.name}</h2>
              <Badge tone={ROLE_TONE[user.role] ?? "slate"}>{user.role}</Badge>
            </div>
            <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-300">
              <div className="flex min-w-0 items-center gap-1.5"><dt className="sr-only">Email</dt><Mail size={15} aria-hidden="true" className="shrink-0 text-slate-400" /><dd className="break-all">{user.email}</dd></div>
              <div className="flex items-center gap-1.5"><dt className="sr-only">Nomor HP</dt><Phone size={15} aria-hidden="true" className="shrink-0 text-slate-400" /><dd>{user.phone}</dd></div>
              <div className="flex items-center gap-1.5"><dt className="sr-only">Bergabung</dt><CalendarDays size={15} aria-hidden="true" className="shrink-0 text-slate-400" /><dd>Bergabung {formatDate(user.created_at)}</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
        <UserEditForm user={{ id: user.id, name: user.name, email: user.email, phone: user.phone }} />
        <section aria-labelledby="ringkasan-title" className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 id="ringkasan-title" className="font-display text-xl font-bold uppercase">{user.role === "seller" ? "Ringkasan toko" : "Ringkasan belanja"}</h2>
          <Summary user={user} s={summary} />
        </section>
      </div>
    </>
  );
}
