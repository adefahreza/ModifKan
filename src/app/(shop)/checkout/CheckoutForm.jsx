"use client";

import { useActionState } from "react";
import { checkoutAction } from "@/lib/actions/orders";
import SubmitButton from "@/components/SubmitButton";

export default function CheckoutForm() {
  const [state, formAction] = useActionState(checkoutAction, { message: "" });
  return (
    <form action={formAction} className="space-y-3">
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}
      <SubmitButton pendingText="Memproses…" size="lg" className="w-full">Buat Pesanan</SubmitButton>
    </form>
  );
}
