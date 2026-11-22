"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/categories";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/SubmitButton";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import { showToast } from "@/lib/toast-client";

export function CreateCategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, { errors: {}, values: { name: "" } });
  useEffect(() => {
    if (state.saved) showToast("kategori-ditambah");
  }, [state.saved]);
  return (
    <form key={state.saved ?? "new"} action={formAction} className="flex items-start gap-2" noValidate>
      <Field label="Nama kategori" name="name" defaultValue={state.values.name} error={state.errors.name} className="w-full max-w-xs" />
      <SubmitButton className="mt-6">Tambah</SubmitButton>
    </form>
  );
}

// Satu baris daftar kategori. Saat Edit, seluruh baris berganti mode: input menggantikan nama,
// tombol menjadi Simpan/Batal, dan Hapus disembunyikan supaya baris tetap sejajar.
export function CategoryRow({ category, deleteAction }) {
  const errorId = useId();
  const [openAt, setOpenAt] = useState(null);
  const [state, formAction] = useActionState(updateCategoryAction.bind(null, category.id), {
    errors: {}, values: { name: category.name },
  });
  useEffect(() => {
    if (state.saved) showToast("kategori-disimpan");
  }, [state.saved]);
  const editing = openAt !== null && openAt.saved === state.saved;
  const error = state.errors.name || state.message;

  if (!editing) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="font-semibold">{category.name}</p>
          <p className="text-sm text-slate-500">{category.product_count} produk</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setOpenAt({ saved: state.saved })}>Edit</Button>
          <ConfirmActionButton action={deleteAction} title="Hapus kategori?"
            message={`Kategori “${category.name}” akan dihapus permanen.`} confirmLabel="Ya, hapus" successToast="kategori-dihapus">Hapus</ConfirmActionButton>
        </div>
      </li>
    );
  }
  return (
    <li className="p-4">
      <span className="sr-only">Mengedit {category.name}</span>
      <form action={formAction} className="flex flex-wrap items-center gap-2" noValidate>
        <input name="name" defaultValue={state.values.name} autoFocus
          aria-label={`Nama kategori ${category.name}`} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined}
          className={`block min-h-11 min-w-0 flex-1 basis-48 rounded-lg bg-white px-3 text-base text-slate-900 ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${error ? "ring-red-500" : "ring-slate-300"}`} />
        <div className="flex items-center gap-2">
          <SubmitButton size="sm">Simpan</SubmitButton>
          <Button size="sm" variant="secondary" onClick={() => setOpenAt(null)}>Batal</Button>
        </div>
      </form>
      {error ? <p id={errorId} className="mt-1 text-sm text-red-600">{error}</p> : null}
    </li>
  );
}
