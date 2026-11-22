import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { updateAddressAction } from "@/lib/actions/addresses";
import AddressForm from "@/components/account/AddressForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Ubah alamat — ModifKan" };

export default async function EditAddressPage({ params }) {
  const user = await requireRole("buyer");
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) notFound();
  const { rows } = await query("addresses/find", [Number(id), user.id]);
  const a = rows[0];
  if (!a) notFound();
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Ubah alamat</h1>
      <AddressForm
        action={updateAddressAction.bind(null, a.id)}
        initial={{ recipient: a.recipient, phone: a.phone, address: a.address, city: a.city, postalCode: a.postal_code }}
      />
    </div>
  );
}
