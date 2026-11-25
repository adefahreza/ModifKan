import Link from "next/link";
import { Users } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { Pencil, Search } from "lucide-react";
import { query } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import { deleteUserAction } from "@/lib/actions/users";

export const metadata = { title: "Pengguna — ModifKan" };

const STORE_TONE = { pending: "amber", approved: "emerald", rejected: "red", suspended: "orange" };
const STORE_LABEL = { pending: "Pending", approved: "Approved", rejected: "Rejected", suspended: "Ditangguhkan" };

function Actions({ u }) {
  return (
    <div className="flex gap-2">
      <Button as={Link} href={`/admin/users/${u.id}/edit`} variant="secondary" size="sm"><Pencil size={14} aria-hidden="true" /> Edit</Button>
      <ConfirmActionButton action={deleteUserAction.bind(null, u.id)} title="Hapus pengguna?"
        message="Akun ini beserta toko, produk, dan ulasannya akan dihapus permanen." confirmLabel="Ya, hapus" successToast="pengguna-dihapus">Hapus</ConfirmActionButton>
    </div>
  );
}

export default async function UsersPage({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const { rows } = await query("users/list", [q === "" ? null : q]);

  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Pengguna</h1>
      <form method="get" role="search" className="mt-4 flex gap-2">
        <input type="search" name="q" defaultValue={q} placeholder="Cari nama atau email" aria-label="Cari pengguna"
          className="min-h-11 w-full max-w-sm rounded-lg bg-white px-3 text-base ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" />
        <Button type="submit" variant="dark"><Search size={16} aria-hidden="true" /> Cari</Button>
      </form>

      {rows.length === 0 ? (
        <EmptyState icon={Users} title={q ? `Tidak ada pengguna yang cocok dengan “${q}”` : "Belum ada pengguna"} className="mt-6" />
      ) : (
        <>
          <div className="mt-4 hidden overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                <tr>{["Nama", "Email", "HP", "Peran", "Toko", ""].map((h) => <th key={h} scope="col" className="px-4 py-3">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-semibold">{u.name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">{u.phone}</td>
                    <td className="px-4 py-3"><Badge tone={u.role === "seller" ? "blue" : "slate"}>{u.role}</Badge></td>
                    <td className="px-4 py-3">
                      {u.store_status ? <span className="flex items-center gap-2">{u.store_name} <Badge tone={STORE_TONE[u.store_status]}>{STORE_LABEL[u.store_status]}</Badge></span> : "—"}
                    </td>
                    <td className="px-4 py-3"><Actions u={u} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 space-y-3 md:hidden">
            {rows.map((u) => (
              <li key={u.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{u.name}</p>
                  <Badge tone={u.role === "seller" ? "blue" : "slate"}>{u.role}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{u.email} · {u.phone}</p>
                {u.store_status ? (
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">{u.store_name} <Badge tone={STORE_TONE[u.store_status]}>{STORE_LABEL[u.store_status]}</Badge></p>
                ) : null}
                <div className="mt-3"><Actions u={u} /></div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
