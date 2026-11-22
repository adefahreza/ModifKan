import ErrorScreen from "@/components/ui/ErrorScreen";

export const metadata = { title: "Halaman tidak ditemukan — ModifKan" };

export default function NotFound() {
  return <ErrorScreen code="404" title="Halaman tidak ditemukan" description="Alamat yang Anda buka tidak ada atau sudah dipindahkan." />;
}
