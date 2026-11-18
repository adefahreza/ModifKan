"use client";

import { useEffect, useId, useState } from "react";

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
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{label}{required ? "" : " (opsional)"}</label>
      {shown ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shown} alt={preview ? "Pratinjau gambar baru" : "Gambar saat ini"} className="mb-2 h-32 w-32 rounded-lg object-cover ring-1 ring-slate-200" />
      ) : null}
      <input id={id} name={name} type="file" accept="image/jpeg,image/png,image/webp" onChange={onChange}
        aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined}
        className="block w-full text-sm file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:font-semibold file:text-white hover:file:bg-slate-800" />
      <p className="mt-1 text-xs text-slate-500">JPG, PNG, atau WEBP, maksimal 2 MB.</p>
      {error ? <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
