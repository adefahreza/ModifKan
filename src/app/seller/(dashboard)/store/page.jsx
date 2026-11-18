import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { imageUrl } from "@/lib/format";
import StoreForm from "./StoreForm";

export const metadata = { title: "Toko Saya — ModifKan" };

export default async function StorePage({ searchParams }) {
  const user = await requireApprovedSeller();
  const sp = await searchParams;
  const { rows } = await query("stores/find-by-id", [user.storeId]);
  if (!rows[0]) notFound();
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Toko Saya</h1>
      {sp.saved === "1" ? <p role="status" className="mt-4 max-w-lg rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Perubahan toko tersimpan.</p> : null}
      <StoreForm store={rows[0]} imageUrl={imageUrl(rows[0].image)} />
    </>
  );
}
