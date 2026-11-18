/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Mail, Pencil, Phone, Store, User } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { formatDate, imageUrl } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/dashboard/StatCard";

export const metadata = { title: "Toko Saya — ModifKan" };

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
        <dd className="break-words text-sm text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

export default async function StorePage({ searchParams }) {
  const user = await requireApprovedSeller();
  const sp = await searchParams;
  const [{ rows }, { rows: stats }] = await Promise.all([
    query("stores/find-by-id", [user.storeId]),
    query("stores/seller-stats", [user.storeId]),
  ]);
  const store = rows[0];
  if (!store) notFound();
  const photo = imageUrl(store.image);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">Toko Saya</h1>
        <Button as={Link} href="/seller/store/edit"><Pencil size={16} aria-hidden="true" /> Edit Toko</Button>
      </div>
      {sp.saved === "1" ? <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Perubahan toko tersimpan.</p> : null}

      <section className="mt-5 flex flex-col gap-5 rounded-xl bg-white p-5 ring-1 ring-slate-200 sm:flex-row">
        <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 sm:size-36">
          {photo ? <img src={photo} alt={`Gambar toko ${store.name}`} className="size-full object-cover" /> : <Store size={40} className="text-slate-400" aria-hidden="true" />}
        </div>
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-bold uppercase">{store.name}</h2>
          <Badge tone="emerald" className="mt-2"><BadgeCheck size={14} aria-hidden="true" /> Seller terverifikasi</Badge>
          <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{store.description || "Belum ada deskripsi toko."}</p>
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="mb-4 font-display text-xl font-bold uppercase">Info Pemilik</h2>
          <dl className="space-y-4">
            <InfoRow icon={User} label="Nama pemilik">{user.name}</InfoRow>
            <InfoRow icon={Mail} label="Email">{user.email}</InfoRow>
            <InfoRow icon={Phone} label="Nomor HP">{user.phone}</InfoRow>
            <InfoRow icon={Store} label="Bergabung sejak">{formatDate(store.created_at)}</InfoRow>
          </dl>
        </section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:content-start">
          <StatCard label="Produk" value={stats[0].product_count} href="/seller/products" />
          <StatCard label="Stok habis" value={stats[0].out_of_stock_count} href="/seller/products" />
        </div>
      </div>
    </>
  );
}
