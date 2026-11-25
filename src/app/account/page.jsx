import { requireRole } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import ProfileSettings from "./ProfileSettings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Akun Saya — ModifKan" };

export default async function AccountHome() {
  const user = await requireRole("buyer");
  return (
    <>
      <h1 className="sr-only">Profil</h1>
      <ProfileSettings user={{ name: user.name, email: user.email, phone: user.phone, joined: formatDate(user.createdAt) }} />
    </>
  );
}
