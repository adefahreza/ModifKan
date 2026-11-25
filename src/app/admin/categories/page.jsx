import { query } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { Tags } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { deleteCategoryAction } from "@/lib/actions/categories";
import { CategoryRow, CreateCategoryForm } from "./CategoryForm";

export const metadata = { title: "Kategori — ModifKan" };

export default async function CategoriesPage() {
  await requireRole("admin"); // wajib di halaman: layout bisa dilewati lewat request RSC
  const { rows } = await query("categories/list");
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Kategori</h1>
      <div className="mt-4 rounded-xl bg-white p-5 ring-1 ring-slate-200"><CreateCategoryForm /></div>

      {rows.length === 0 ? (
        <EmptyState icon={Tags} title="Belum ada kategori" description="Tambahkan kategori lewat form di atas." className="mt-6" />
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
          {rows.map((c) => <CategoryRow key={c.id} category={c} deleteAction={deleteCategoryAction.bind(null, c.id)} />)}
        </ul>
      )}
    </>
  );
}
