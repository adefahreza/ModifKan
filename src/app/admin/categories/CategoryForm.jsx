"use client";

import { useActionState, useState } from "react";
import { createCategoryAction, updateCategoryAction } from "@/lib/actions/categories";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import SubmitButton from "@/components/SubmitButton";

export function CreateCategoryForm() {
  const [state, formAction] = useActionState(createCategoryAction, { errors: {}, values: { name: "" } });
  return (
    <form key={state.saved ?? "new"} action={formAction} className="flex items-start gap-2" noValidate>
      <Field label="Nama kategori" name="name" defaultValue={state.values.name} error={state.errors.name} className="w-full max-w-xs" />
      <SubmitButton className="mt-6">Tambah</SubmitButton>
    </form>
  );
}

export function EditCategory({ category }) {
  const [openAt, setOpenAt] = useState(null);
  const [state, formAction] = useActionState(updateCategoryAction.bind(null, category.id), {
    errors: {}, values: { name: category.name },
  });
  const editing = openAt !== null && openAt.saved === state.saved;

  if (!editing) return <Button size="sm" variant="secondary" onClick={() => setOpenAt({ saved: state.saved })}>Edit</Button>;
  return (
    <form action={formAction} className="flex items-start gap-2" noValidate>
      <Field label="Nama" name="name" defaultValue={state.values.name} error={state.errors.name || state.message} aria-label={`Nama kategori ${category.name}`} />
      <SubmitButton size="sm" className="mt-6">Simpan</SubmitButton>
      <Button size="sm" variant="ghost" className="mt-6" onClick={() => setOpenAt(null)}>Batal</Button>
    </form>
  );
}
