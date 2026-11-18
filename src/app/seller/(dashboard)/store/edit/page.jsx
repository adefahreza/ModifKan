import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { imageUrl } from "@/lib/format";
import StoreForm from "../StoreForm";

export const metadata = { title: "Edit Toko — ModifKan" };

export default async function EditStorePage() {
  const user = await requireApprovedSeller();
  const { rows } = await query("stores/find-by-id", [user.storeId]);
  if (!rows[0]) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/seller/store" className="hover:text-slate-900">Toko Saya</Link> / <span aria-current="page" className="text-slate-900">Edit</span>
      </nav>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase">Edit Toko</h1>
      <StoreForm store={rows[0]} imageUrl={imageUrl(rows[0].image)} />
    </>
  );
}
