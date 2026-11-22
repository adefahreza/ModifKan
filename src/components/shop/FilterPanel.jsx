"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "harga_terendah", label: "Harga terendah" },
  { value: "harga_tertinggi", label: "Harga tertinggi" },
];

const inputCls =
  "min-h-11 w-full rounded-lg bg-white px-3 text-sm text-slate-900 ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";

function FilterForm({ categories, filters }) {
  const uid = useId();
  return (
    <form method="get" action="/products" className="space-y-5">
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      {filters.sort !== "terbaru" ? <input type="hidden" name="sort" value={filters.sort} /> : null}

      <fieldset className="space-y-1">
        <legend className="mb-2 text-sm font-semibold text-slate-900">Kategori</legend>
        {[{ id: "", name: "Semua" }, ...categories].map((c) => {
          const value = String(c.id);
          const id = `${uid}-cat-${value || "all"}`;
          return (
            <label key={id} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-700">
              <input id={id} type="radio" name="category" value={value}
                defaultChecked={value === (filters.categoryId === null ? "" : String(filters.categoryId))}
                className="size-4 accent-red-600" />
              {c.name}
            </label>
          );
        })}
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold text-slate-900">Harga (Rp)</legend>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label htmlFor={`${uid}-min`} className="sr-only">Harga minimum</label>
            <input id={`${uid}-min`} name="min" type="number" inputMode="numeric" min="0" placeholder="Min"
              defaultValue={filters.minPrice ?? ""} className={inputCls} />
          </div>
          <span aria-hidden="true" className="text-slate-400">–</span>
          <div className="flex-1">
            <label htmlFor={`${uid}-max`} className="sr-only">Harga maksimum</label>
            <input id={`${uid}-max`} name="max" type="number" inputMode="numeric" min="0" placeholder="Maks"
              defaultValue={filters.maxPrice ?? ""} className={inputCls} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-1">
        <legend className="mb-2 text-sm font-semibold text-slate-900">Rating</legend>
        {[{ value: "", label: "Semua" }, ...[4, 3, 2, 1].map((n) => ({ value: String(n), label: `\u2605 ${n} ke atas` }))].map((r) => {
          const id = `${uid}-rating-${r.value || "all"}`;
          return (
            <label key={id} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-700">
              <input id={id} type="radio" name="rating" value={r.value}
                defaultChecked={r.value === (filters.minRating === null ? "" : String(filters.minRating))}
                className="size-4 accent-red-600" />
              {r.label}
            </label>
          );
        })}
      </fieldset>

      <div className="flex gap-2">
        <button type="submit"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
          Terapkan
        </button>
        <Link href={filters.q ? `/products?q=${encodeURIComponent(filters.q)}` : "/products"}
          className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          Reset
        </Link>
      </div>
    </form>
  );
}

export function SortSelect({ filters }) {
  const id = useId();
  return (
    <form method="get" action="/products" className="flex items-center gap-2">
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      {filters.categoryId !== null ? <input type="hidden" name="category" value={filters.categoryId} /> : null}
      {filters.minPrice !== null ? <input type="hidden" name="min" value={filters.minPrice} /> : null}
      {filters.maxPrice !== null ? <input type="hidden" name="max" value={filters.maxPrice} /> : null}
      {filters.minRating !== null ? <input type="hidden" name="rating" value={filters.minRating} /> : null}
      <label htmlFor={id} className="text-sm text-slate-600">Urutkan</label>
      {/* Panah bawaan browser disembunyikan (appearance-none) dan diganti ikon supaya jaraknya bisa diatur. */}
      <div className="relative">
        <select id={id} name="sort" defaultValue={filters.sort}
          onChange={(e) => e.currentTarget.form.requestSubmit()}
          className={`${inputCls} w-auto appearance-none pr-10`}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown data-select-arrow size={16} aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
      </div>
      <noscript><button type="submit" className="text-sm font-semibold text-red-600">Terapkan</button></noscript>
    </form>
  );
}

export default function FilterPanel({ categories, filters, header, children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="space-y-4 lg:grid lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-6 lg:space-y-0">
      <aside className="hidden lg:block" aria-label="Filter produk">
        <div className="sticky top-24 rounded-xl bg-white p-4 ring-1 ring-slate-200">
          <h2 className="mb-4 font-display text-lg font-bold uppercase text-slate-900">Filter</h2>
          <FilterForm categories={categories} filters={filters} />
        </div>
      </aside>

      <div className="min-w-0 space-y-4">
        {header}
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 lg:hidden">
            <SlidersHorizontal size={16} aria-hidden="true" /> Filter
          </button>
          <div className="ml-auto"><SortSelect filters={filters} /></div>
        </div>
        {children}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Tutup filter" onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-900/60" />
          <div role="dialog" aria-modal="true" aria-label="Filter produk"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-4 pb-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold uppercase text-slate-900">Filter</h2>
              <button type="button" aria-label="Tutup" onClick={() => setOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <FilterForm categories={categories} filters={filters} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
