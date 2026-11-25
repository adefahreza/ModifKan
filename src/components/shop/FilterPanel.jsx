"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "harga_terendah", label: "Harga terendah" },
  { value: "harga_tertinggi", label: "Harga tertinggi" },
];

const RATING_OPTIONS = [{ value: "", label: "Semua" }, ...[4, 3, 2, 1].map((n) => ({ value: String(n), label: `★ ${n} ke atas` }))];

const inputCls =
  "min-h-11 w-full rounded-lg bg-white px-3 text-sm text-slate-900 ring-1 ring-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";
const iconButtonCls =
  "inline-flex size-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";
const toggleCls =
  "min-h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";

function RadioGroup({ legend, name, options, selected }) {
  const uid = useId();
  return (
    <fieldset className="space-y-1">
      <legend className="mb-2 text-sm font-semibold text-slate-900">{legend}</legend>
      {options.map((o) => {
        const id = `${uid}-${o.value || "all"}`;
        return (
          <label key={id} htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-slate-700">
            <input id={id} type="radio" name={name} value={o.value} defaultChecked={o.value === selected} className="size-4 accent-red-600" />
            {o.label}
          </label>
        );
      })}
    </fieldset>
  );
}

// Urutan, harga, dan rating; kategori dipilih lewat chip di atas daftar produk.
// Isinya bergulir sendiri, sedangkan tombol Terapkan dan Reset tetap di bawah (layar pendek).
function FilterForm({ filters }) {
  const uid = useId();
  // Reset mengosongkan isi panel saja; pencarian dan kategori tetap.
  const kept = new URLSearchParams();
  if (filters.q) kept.set("q", filters.q);
  if (filters.categoryId !== null) kept.set("category", String(filters.categoryId));
  const resetHref = kept.size ? `/products?${kept}` : "/products";

  // key: form dipasang ulang saat isi URL berubah, supaya pilihan ikut berganti (mis. sesudah Reset).
  return (
    <form key={`${filters.sort}-${filters.minPrice}-${filters.maxPrice}-${filters.minRating}`} method="get" action="/products"
      className="flex min-h-0 flex-1 flex-col">
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      {filters.categoryId !== null ? <input type="hidden" name="category" value={filters.categoryId} /> : null}

      <div className="-mx-1 min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-1">
        <RadioGroup legend="Urutkan" name="sort" options={SORT_OPTIONS} selected={filters.sort} />

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

        <RadioGroup legend="Rating" name="rating" options={RATING_OPTIONS} selected={filters.minRating === null ? "" : String(filters.minRating)} />
      </div>

      <div className="flex shrink-0 gap-2 border-t border-slate-200 pt-3">
        <button type="submit"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
          Terapkan
        </button>
        <Link href={resetHref}
          className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
          Reset
        </Link>
      </div>
    </form>
  );
}

function PanelHeader({ onClose }) {
  return (
    <div className="mb-2 flex shrink-0 items-center justify-between">
      <h2 className="font-display text-lg font-bold uppercase text-slate-900">Filter</h2>
      <button type="button" aria-label="Tutup" onClick={onClose} className={iconButtonCls}>
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

function ToggleLabel({ active }) {
  return (
    <>
      <SlidersHorizontal size={16} aria-hidden="true" /> Filter
      {active > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
          {active}<span className="sr-only"> aktif</span>
        </span>
      ) : null}
    </>
  );
}

// Filter tersembunyi sampai tombolnya ditekan. Layar lebar: panel di samping (produk menyesuaikan).
// Layar kecil: lembar dari bawah. Keduanya punya tombol dan status sendiri.
export default function FilterPanel({ filters, header, children }) {
  const [sideOpen, setSideOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sideId = useId();
  const cardRef = useRef(null);
  const rowRef = useRef(null);
  const latestTransition = useRef(0);

  // Buka/tutup lewat View Transitions: panel bergeser dan tiap kartu produk berpindah mulus ke susunan barunya.
  // Browser tanpa dukungan, atau pengguna yang meminta gerak dikurangi, langsung berubah.
  function toggleSide(next) {
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSideOpen(next);
      return;
    }
    const cards = [...(rowRef.current.querySelector("[data-product-grid]")?.children ?? [])];
    cards.forEach((card, i) => { card.style.viewTransitionName = `kartu-produk-${i}`; });
    const turn = ++latestTransition.current;
    const transition = document.startViewTransition(() => flushSync(() => setSideOpen(next)));
    // Nama hanya dibersihkan oleh transisi terakhir, supaya klik cepat tidak menghapus nama milik transisi berikutnya.
    transition.finished.finally(() => {
      if (turn === latestTransition.current) cards.forEach((card) => { card.style.viewTransitionName = ""; });
    });
  }

  // Jumlah pilihan yang aktif (rentang harga dihitung satu).
  const active = [filters.sort !== "terbaru", filters.minPrice !== null || filters.maxPrice !== null, filters.minRating !== null]
    .filter(Boolean).length;

  // Hanya lembar bawah yang mengunci gulir halaman.
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setSheetOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  // Tinggi panel samping mengikuti ruang yang tersisa di layar, supaya Terapkan dan Reset selalu terlihat.
  // Batas bawah 320px untuk layar yang sangat pendek. useLayoutEffect: tinggi sudah benar saat animasi dipotret.
  useLayoutEffect(() => {
    if (!sideOpen) return;
    const card = cardRef.current;
    const fit = () => {
      const top = Math.max(card.getBoundingClientRect().top, 16);
      card.style.maxHeight = `${Math.max(window.innerHeight - top - 16, 320)}px`;
    };
    fit();
    window.addEventListener("scroll", fit, { passive: true });
    window.addEventListener("resize", fit);
    return () => {
      window.removeEventListener("scroll", fit);
      window.removeEventListener("resize", fit);
    };
  }, [sideOpen]);

  return (
    <div className="space-y-4">
      {header}

      <button type="button" onClick={() => setSheetOpen(true)} aria-haspopup="dialog" className={`inline-flex lg:hidden ${toggleCls}`}>
        <ToggleLabel active={active} />
      </button>
      <button type="button" onClick={() => toggleSide(!sideOpen)} aria-expanded={sideOpen} aria-controls={sideId}
        className={`hidden lg:inline-flex ${toggleCls}`}>
        <ToggleLabel active={active} />
      </button>

      {/* data-filter-open dipakai ProductGrid untuk mengurangi satu kolom saat panel terbuka. */}
      <div ref={rowRef} data-filter-open={sideOpen} className="group/catalog lg:flex lg:items-start lg:gap-6">
        <aside id={sideId} aria-label="Filter produk" style={{ viewTransitionName: "filter-panel" }} className={`sticky top-4 hidden w-64 shrink-0 ${sideOpen ? "lg:block" : ""}`}>
          <div ref={cardRef} className="flex max-h-[calc(100vh-2rem)] flex-col rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <PanelHeader onClose={() => toggleSide(false)} />
            <FilterForm filters={filters} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {sheetOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Tutup filter" onClick={() => setSheetOpen(false)} className="filter-latar absolute inset-0 bg-slate-900/60" />
          <div role="dialog" aria-modal="true" aria-label="Filter produk"
            className="filter-lembar absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white p-4 pb-6">
            <PanelHeader onClose={() => setSheetOpen(false)} />
            <FilterForm filters={filters} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
