import { requireRole } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { updateAdminProfileAction, changeAdminPasswordAction } from "@/lib/actions/profile";
import ProfileSettings from "@/app/account/ProfileSettings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profil Saya — ModifKan" };

export default async function AdminProfilePage() {
  const user = await requireRole("admin");
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Profil Saya</h1>
      <div className="mt-5 rounded-xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
        <ProfileSettings
          user={{ name: user.name, email: user.email, phone: user.phone, joined: formatDate(user.createdAt), roleLabel: "Administrator" }}
          updateAction={updateAdminProfileAction} passwordAction={changeAdminPasswordAction} showPhoto={false}
          note="Nomor HP ini ditampilkan ke seller yang ditangguhkan sebagai kontak Customer Service." />
      </div>
    </>
  );
}
