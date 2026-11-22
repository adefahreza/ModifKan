"use client";

import { useEffect, useRef, useState } from "react";
import CategoryIcon from "./CategoryIcon";

// Gambar gagal dimuat (file hilang) -> kotak abu-abu dengan ikon kategori, ukuran tetap sama supaya layout tidak loncat.
export default function ProductImage({ src, alt = "", categoryName, className = "", iconSize = 32, fallback, ...imgProps }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);

  // Error yang terjadi sebelum hidrasi tidak memicu onError, jadi periksa lagi setelah mount (dan saat src berganti).
  useEffect(() => {
    const img = ref.current;
    setFailed(Boolean(img && img.complete && img.naturalWidth === 0));
  }, [src]);

  if (!src || failed) {
    return (
      <div role={alt ? "img" : undefined} aria-label={alt || undefined}
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        {fallback ?? <CategoryIcon name={categoryName} size={iconSize} />}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={src} alt={alt} onError={() => setFailed(true)} className={className} {...imgProps} />;
}
