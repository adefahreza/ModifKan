import { requireRole } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Akun Saya — ModifKan" };

export default async function AccountHome() {
  const user = await requireRole("buyer");
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Profil</h1>
      <div className="mt-5 grid max-w-4xl gap-5 lg:grid-cols-2 lg:items-start">
        <ProfileForm user={{ name: user.name, email: user.email, phone: user.phone }} />
        <PasswordForm />
      </div>
    </>
  );
}
