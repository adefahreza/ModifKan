import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import { MapPin, Pencil, Plus } from "lucide-react";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { deleteAddressAction } from "@/lib/actions/addresses";
import Button from "@/components/ui/Button";
import ConfirmActionButton from "@/components/ConfirmActionButton";

export const dynamic = "force-dynamic";

export const metadata = { title: "Alamat — ModifKan" };

export default async function AddressesPage() {
  const user = await requireRole("buyer");
  const { rows } = await query("addresses/list", [user.id]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Alamat</h1>
        <Button as={Link} href="/account/addresses/new"><Plus size={16} aria-hidden="true" /> Tambah alamat</Button>
      </div>
      {rows.length === 0 ? (
        <EmptyState icon={MapPin} title="Belum ada alamat" description="Tambahkan alamat agar bisa membuat pesanan." />
      ) : (
        // Satu kartu per baris, selebar kotak akun; di layar lebar tombol aksi pindah ke kanan.
        <ul className="space-y-3">
          {rows.map((a) => (
            <li key={a.id} className="flex flex-col gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{a.recipient} <span className="font-normal text-slate-600">· {a.phone}</span></p>
                <p className="mt-1">{a.address}, {a.city} {a.postal_code}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button as={Link} href={`/account/addresses/${a.id}/edit`} variant="secondary" size="sm"><Pencil size={14} aria-hidden="true" /> Edit</Button>
                <ConfirmActionButton action={deleteAddressAction.bind(null, a.id)} title="Hapus alamat?"
                  message="Alamat ini akan dihapus. Pesanan yang sudah dibuat tidak terpengaruh." confirmLabel="Ya, hapus" successToast="alamat-dihapus">Hapus</ConfirmActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
