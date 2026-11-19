import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { homePathFor } from "@/lib/auth-rules";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "Daftar — ModifKan" };

export default async function RegisterPage({ searchParams }) {
  const { role } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(homePathFor(user));
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Daftar</h1>
      <RegisterForm initialRole={role === "seller" ? "seller" : "buyer"} />
      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun? <Link href="/login" className="font-semibold text-red-600 hover:underline">Masuk</Link>
      </p>
    </>
  );
}
