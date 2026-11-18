import { useId } from "react";

export default function Field({ label, name, type = "text", error, defaultValue, hint, className = "", ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`block min-h-11 w-full rounded-lg bg-white px-3 text-base text-slate-900 ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${error ? "ring-red-500" : "ring-slate-300"}`}
        {...inputProps}
      />
      {hint && !error ? <p id={hintId} className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      {error ? <p id={errorId} className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
