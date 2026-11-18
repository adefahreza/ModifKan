import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Field from "@/components/ui/Field";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="rounded-xl bg-slate-900 p-6 stripe-red"><Logo size="lg" /></div>
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="dark">Dark</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <Field label="Email" name="email" defaultValue="salah" error="Format email tidak valid" />
      <div className="flex flex-wrap gap-2">
        <Badge tone="amber">Menunggu Pembayaran</Badge>
        <Badge tone="blue">Diproses</Badge>
        <Badge tone="violet">Dikirim</Badge>
        <Badge tone="emerald">Selesai</Badge>
        <Badge tone="slate">Dibatalkan</Badge>
      </div>
      <h1 className="font-display text-4xl font-bold uppercase">Judul Barlow Condensed</h1>
    </div>
  );
}
