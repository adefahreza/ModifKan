export default function StockLabel({ stock, className = "" }) {
  if (stock === 0) {
    return <span data-badge="stok" className={`inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700 ${className}`}>Stok habis</span>;
  }
  if (stock <= 5) {
    return <span data-badge="stok" className={`inline-flex rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900 ${className}`}>Sisa {stock}</span>;
  }
  return null;
}
