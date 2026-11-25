import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Store } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { formatDate, imageUrl } from "@/lib/format";
import Badge from "@/components/ui/Badge";
import ProductImage from "@/components/shop/ProductImage";
import StoreSettings from "../StoreSettings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit Toko — ModifKan" };

const STORE_TONE = { pending: "amber", approved: "emerald", rejected: "red" };
const STORE_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected" };

export default async function EditStorePage() {
  const user = await requireApprovedSeller();
  const { rows } = await query("stores/find-by-id", [user.storeId]);
  const store = rows[0];
  if (!store) notFound();

  // Banner menampilkan data toko yang tersimpan (bukan isian form yang sedang diketik).
  const banner = (
    <section aria-labelledby="store-banner-title" className="stripe-red relative overflow-hidden bg-slate-900 p-5 text-white sm:p-6">
      <div aria-hidden="true" className="absolute -right-12 -top-12 size-40 rounded-full border-[20px] border-slate-700/40" />
      <div className="relative flex items-center gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-700 text-slate-300 ring-2 ring-red-500 sm:size-20">
          {store.image
            ? <ProductImage src={imageUrl(store.image)} alt={`Gambar toko ${store.name}`} fallback={<Store size={28} aria-hidden="true" />} className="size-full object-cover" />
            : <Store size={28} aria-hidden="true" />}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id="store-banner-title" className="break-words font-display text-3xl font-extrabold uppercase italic leading-none">{store.name}</h2>
            <Badge tone={STORE_TONE[store.status]}>{STORE_LABEL[store.status]}</Badge>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300"><BadgeCheck size={15} aria-hidden="true" /> Seller terverifikasi</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} aria-hidden="true" className="text-slate-400" /> Buka sejak {formatDate(store.created_at)}</span>
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/seller/store" className="hover:text-slate-900">Toko Saya</Link> / <span aria-current="page" className="text-slate-900">Edit</span>
      </nav>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase">Edit Toko</h1>
      <StoreSettings store={store} owner={{ email: user.email, phone: user.phone }} imageUrl={imageUrl(store.image)} header={banner} />
    </>
  );
}
