"use client";

import { startTransition, useActionState, useId, useState } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { createReviewAction } from "@/lib/actions/reviews";
import Button from "@/components/ui/Button";

export default function ReviewForm({ orderItemId }) {
  const [action] = useState(() => createReviewAction.bind(null, orderItemId));
  const [state, formAction, pending] = useActionState(action, { errors: {}, values: {} });
  const [rating, setRating] = useState(0);
  const id = useId();

  if (state.done) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <CheckCircle2 size={16} aria-hidden="true" /> {state.message}
      </p>
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
      {state.message ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.message}</p> : null}

      <fieldset aria-describedby={state.errors.rating ? `${id}-rating-error` : undefined}>
        <legend className="mb-1 text-sm font-medium text-slate-700">Rating</legend>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer rounded p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-red-500">
              <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} className="sr-only" />
              <Star size={28} aria-hidden="true" className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
              <span className="sr-only">{n} bintang</span>
            </label>
          ))}
        </div>
        {state.errors.rating ? <p id={`${id}-rating-error`} className="mt-1 text-sm text-red-600">{state.errors.rating}</p> : null}
      </fieldset>

      <div>
        <label htmlFor={`${id}-comment`} className="mb-1 block text-sm font-medium text-slate-700">Komentar</label>
        <textarea id={`${id}-comment`} name="comment" rows={3} maxLength={1000} defaultValue={state.values.comment ?? ""}
          aria-invalid={state.errors.comment ? true : undefined}
          aria-describedby={state.errors.comment ? `${id}-comment-error` : undefined}
          className={`block w-full rounded-lg bg-white px-3 py-2 text-base ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${state.errors.comment ? "ring-red-500" : "ring-slate-300"}`} />
        {state.errors.comment ? <p id={`${id}-comment-error`} className="mt-1 text-sm text-red-600">{state.errors.comment}</p> : null}
      </div>

      <Button type="submit" size="sm" disabled={pending}>{pending ? "Mengirim…" : "Kirim ulasan"}</Button>
    </form>
  );
}
