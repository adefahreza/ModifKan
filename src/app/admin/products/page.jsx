/* eslint-disable @next/next/no-img-element */
import { Search } from "lucide-react";
import { query } from "@/lib/db";
import { formatRupiah, imageUrl } from "@/lib/format";
import { deleteProductAdminAction } from "@/lib/actions/products";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";

export const metadata = { title: "Moderasi Produk — ModifKan" };

function Stock({ n }) {
  return n === 0 ? <Badge tone="red">Habis</Badge> : <span>{n}</span>;
}

function DeleteButton({ p }) {
  return (
    <ConfirmActionButton action={deleteProductAdminAction.bind(null, p.id)} title="Hapus produk?"
      message={`Produk “${p.name}” dari ${p.store_name} akan dihapus permanen.`} confirmLabel="Ya, hapus">Hapus</ConfirmActionButton>
  );
}

export default async function AdminProductsPage({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const { rows } = await query("products/list-admin", [q === "" ? null : q]);
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Moderasi Produk</h1>
      <form method="get" role="search" className="mt-4 flex gap-2">
        <input type="search" name="q" defaultValue={q} placeholder="Cari nama produk" aria-label="Cari produk"
          className="min-h-11 w-full max-w-sm rounded-lg bg-white px-3 text-base ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" />
        <Button type="submit" variant="dark"><Search size={16} aria-hidden="true" /> Cari</Button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-8 text-center text-slate-600 ring-1 ring-slate-200">
          {q ? `Tidak ada produk yang cocok dengan “${q}”.` : "Belum ada produk."}
        </p>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>{["", "Nama", "Toko", "Kategori", "Harga", "Stok", ""].map((h, i) => <th key={i} scope="col" className="px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3"><img src={imageUrl(p.image)} alt="" className="size-12 rounded-lg object-cover" /></td>
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">{p.store_name}</td>
                    <td className="px-4 py-3">{p.category_name}</td>
                    <td className="px-4 py-3">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-3"><Stock n={p.stock} /></td>
                    <td className="px-4 py-3"><DeleteButton p={p} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 space-y-3 md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex gap-3">
                  <img src={imageUrl(p.image)} alt="" className="size-16 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-slate-600">{p.store_name} · {p.category_name}</p>
                    <p className="text-sm text-slate-600">{formatRupiah(p.price)} · Stok: <Stock n={p.stock} /></p>
                  </div>
                </div>
                <div className="mt-3"><DeleteButton p={p} /></div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
