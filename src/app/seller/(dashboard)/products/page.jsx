/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { query } from "@/lib/db";
import { requireApprovedSeller } from "@/lib/auth";
import { formatRupiah, imageUrl } from "@/lib/format";
import { deleteProductAction } from "@/lib/actions/products";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";

export const metadata = { title: "Produk — ModifKan" };

function Stock({ n }) {
  return n === 0 ? <Badge tone="red">Habis</Badge> : <span>{n}</span>;
}

function Actions({ p }) {
  return (
    <div className="flex gap-2">
      <Button as={Link} href={`/seller/products/${p.id}/edit`} variant="secondary" size="sm"><Pencil size={14} aria-hidden="true" /> Edit</Button>
      <ConfirmActionButton action={deleteProductAction.bind(null, p.id)} title="Hapus produk?"
        message={`Produk “${p.name}” akan dihapus permanen.`} confirmLabel="Ya, hapus">Hapus</ConfirmActionButton>
    </div>
  );
}

export default async function SellerProductsPage() {
  const user = await requireApprovedSeller();
  const { rows } = await query("products/list-by-store", [user.storeId]);
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase">Produk</h1>
        <Button as={Link} href="/seller/products/new"><Plus size={16} aria-hidden="true" /> Tambah Produk</Button>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white p-8 text-center ring-1 ring-slate-200">
          <p className="text-slate-600">Toko belum punya produk.</p>
          <Button as={Link} href="/seller/products/new" className="mt-4">Tambah produk pertama</Button>
        </div>
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>{["", "Nama", "Kategori", "Harga", "Stok", ""].map((h, i) => <th key={i} scope="col" className="px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3"><img src={imageUrl(p.image)} alt="" className="size-12 rounded-lg object-cover" /></td>
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">{p.category_name}</td>
                    <td className="px-4 py-3">{formatRupiah(p.price)}</td>
                    <td className="px-4 py-3"><Stock n={p.stock} /></td>
                    <td className="px-4 py-3"><Actions p={p} /></td>
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
                    <p className="text-sm text-slate-600">{p.category_name} · {formatRupiah(p.price)}</p>
                    <p className="text-sm">Stok: <Stock n={p.stock} /></p>
                  </div>
                </div>
                <div className="mt-3"><Actions p={p} /></div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
