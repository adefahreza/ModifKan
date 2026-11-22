import Link from "next/link";
import Button from "@/components/ui/Button";

// Layar penuh bertema gelap bergaris untuk 404 dan 403.
export default function ErrorScreen({ code, title, description, href = "/", label = "Ke beranda" }) {
  return (
    <main className="stripe-red flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-8xl font-extrabold italic leading-none text-red-500" aria-hidden="true">{code}</p>
        <h1 className="mt-4 font-display text-3xl font-bold uppercase text-white">{title}</h1>
        <p className="mt-2 text-slate-300">{description}</p>
        <Button as={Link} href={href} size="lg" className="mt-6">{label}</Button>
      </div>
    </main>
  );
}
