import Link from "next/link";
import Logo from "@/components/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="stripe-red flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-10">
      <Link href="/" aria-label="ModifKan beranda" className="mb-6"><Logo size="lg" /></Link>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-200 sm:p-8">{children}</div>
    </div>
  );
}
