import { getCurrentUser } from "@/lib/auth";
import { homePathFor } from "@/lib/auth-rules";
import ErrorScreen from "@/components/ui/ErrorScreen";

export const dynamic = "force-dynamic";

export const metadata = { title: "Akses ditolak — ModifKan" };

export default async function ForbiddenPage() {
  const user = await getCurrentUser();
  return (
    <ErrorScreen code="403" title="Akses ditolak" description="Kamu tidak punya akses ke halaman ini."
      href={user ? homePathFor(user) : "/"} label={user ? "Kembali ke halaman utama saya" : "Ke beranda"} />
  );
}
