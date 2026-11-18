/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useId, useState } from "react";
import { ImagePlus } from "lucide-react";

export default function ImageInput({ name = "image", label = "Gambar", currentUrl, error, required }) {
  const id = useId();
  const [preview, setPreview] = useState(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  function onChange(e) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  const shown = preview ?? currentUrl;
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}{required ? "" : " (opsional)"}</span>
      <label htmlFor={id}
        className={`relative flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-slate-50 text-center transition-colors hover:border-red-400 hover:bg-red-50/40 focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 ${error ? "border-red-500" : "border-slate-300"}`}>
        {shown ? (
          <>
            <img src={shown} alt={preview ? "Pratinjau gambar baru" : "Gambar saat ini"} className="absolute inset-0 size-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-slate-900/70 py-2 text-sm font-semibold text-white">Klik untuk mengganti</span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-slate-500">
            <ImagePlus size={32} aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-700">Pilih gambar</span>
          </span>
        )}
        <input id={id} name={name} type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange}
          aria-invalid={error ? true : undefined} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          className="sr-only" />
      </label>
      <p id={`${id}-hint`} className="mt-2 text-xs text-slate-500">JPG, PNG, atau WEBP, maksimal 2 MB. Rasio persegi (1:1) paling rapi.</p>
      {error ? <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
