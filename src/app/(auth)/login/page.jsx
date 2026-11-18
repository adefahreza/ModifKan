import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { homePathFor } from "@/lib/auth-rules";
import LoginForm from "./LoginForm";

export const metadata = { title: "Masuk — ModifKan" };

export default async function LoginPage({ searchParams }) {
  const user = await getCurrentUser();
  if (user) redirect(homePathFor(user));
  const { next } = await searchParams;
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Masuk</h1>
      <LoginForm next={typeof next === "string" ? next : ""} />
      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun? <Link href="/register" className="font-semibold text-red-600 hover:underline">Daftar</Link>
      </p>
    </>
  );
}
