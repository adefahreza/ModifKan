import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { query } from "@/lib/db";
import Badge from "@/components/ui/Badge";
import UserEditForm from "./UserEditForm";

export const metadata = { title: "Edit Pengguna — ModifKan" };

const ROLE_TONE = { buyer: "blue", seller: "violet" };

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default async function EditUserPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { rows } = await query("users/find-by-id", [Number(id)]);
  const user = rows[0];
  if (!user) notFound();
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/admin/users" className="hover:text-slate-900">Pengguna</Link> / <span aria-current="page" className="text-slate-900">Edit</span>
      </nav>
      <h1 className="mt-1 font-display text-3xl font-bold uppercase">Edit Pengguna</h1>

      <div className="mt-5 grid max-w-4xl gap-5 lg:grid-cols-[18rem_1fr] lg:items-start">
        <section aria-labelledby="user-profile-title" className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
          <h2 id="user-profile-title" className="sr-only">Profil pengguna</h2>
          <div className="stripe-red flex flex-col items-center gap-3 bg-slate-900 px-5 py-6 text-center text-white">
            <span aria-hidden="true" className="flex size-20 items-center justify-center rounded-full bg-red-600 font-display text-3xl font-bold">{initials(user.name)}</span>
            <p className="break-words font-display text-2xl font-bold uppercase leading-tight">{user.name}</p>
            <Badge tone={ROLE_TONE[user.role] ?? "slate"}>{user.role}</Badge>
          </div>
          <dl className="space-y-3 p-5 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
              <div className="min-w-0"><dt className="sr-only">Email</dt><dd className="break-all text-slate-900">{user.email}</dd></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
              <div className="min-w-0"><dt className="sr-only">Nomor HP</dt><dd className="text-slate-900">{user.phone}</dd></div>
            </div>
          </dl>
          <p className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">Peran tidak dapat diubah.</p>
        </section>

        <UserEditForm user={user} />
      </div>
    </>
  );
}
