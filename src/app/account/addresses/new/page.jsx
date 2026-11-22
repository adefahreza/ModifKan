import { requireRole } from "@/lib/auth";
import { safeNext } from "@/lib/auth-rules";
import { createAddressAction } from "@/lib/actions/addresses";
import AddressForm from "@/components/account/AddressForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Tambah alamat — ModifKan" };

export default async function NewAddressPage({ searchParams }) {
  await requireRole("buyer");
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null) ?? "";
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl font-bold uppercase text-slate-900">Tambah alamat</h1>
      <AddressForm action={createAddressAction} next={next} cancelHref={next || "/account/addresses"} />
    </div>
  );
}
