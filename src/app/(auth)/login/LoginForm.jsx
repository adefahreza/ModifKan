"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import Field from "@/components/ui/Field";
import SubmitButton from "@/components/SubmitButton";

export default function LoginForm({ next }) {
  const [state, formAction] = useActionState(loginAction, { errors: {}, values: {} });
  return (
    <form action={formAction} className="mt-4 space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.message ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p>
      ) : null}
      <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={state.values.email} error={state.errors.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" error={state.errors.password} />
      <SubmitButton pendingText="Memproses…" className="w-full">Masuk</SubmitButton>
    </form>
  );
}
