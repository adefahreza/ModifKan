import { query } from "@/lib/db";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import { deleteCategoryAction } from "@/lib/actions/categories";
import { CreateCategoryForm, EditCategory } from "./CategoryForm";

export const metadata = { title: "Kategori — ModifKan" };

export default async function CategoriesPage() {
  const { rows } = await query("categories/list");
  return (
    <>
      <h1 className="font-display text-3xl font-bold uppercase">Kategori</h1>
      <div className="mt-4 rounded-xl bg-white p-5 ring-1 ring-slate-200"><CreateCategoryForm /></div>

      {rows.length === 0 ? (
        <p className="mt-6 rounded-xl bg-white p-8 text-center text-slate-600 ring-1 ring-slate-200">Belum ada kategori.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl bg-white ring-1 ring-slate-200">
          {rows.map((c) => (
            <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-slate-500">{c.product_count} produk</p>
              </div>
              <div className="flex items-start gap-2">
                <EditCategory category={c} />
                <ConfirmActionButton action={deleteCategoryAction.bind(null, c.id)} title="Hapus kategori?"
                  message={`Kategori “${c.name}” akan dihapus permanen.`} confirmLabel="Ya, hapus">Hapus</ConfirmActionButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
