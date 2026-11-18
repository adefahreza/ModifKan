import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import UserEditForm from "./UserEditForm";

export const metadata = { title: "Edit Pengguna — ModifKan" };

export default async function EditUserPage({ params }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  const { rows } = await query("users/find-by-id", [Number(id)]);
  if (!rows[0]) notFound();
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Edit Pengguna</h1>
      <UserEditForm user={rows[0]} />
    </>
  );
}
