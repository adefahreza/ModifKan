import { Star } from "lucide-react";

export default function RatingStars({ rating, count, size = 14, showEmpty = false }) {
  if (rating == null) {
    return showEmpty ? <span className="text-xs text-slate-500">Belum ada ulasan</span> : null;
  }
  const value = Number(rating);
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rating ${value.toFixed(1)} dari 5`}>
      <span className="inline-flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={size} className={i <= full ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
        ))}
      </span>
      <span className="text-xs font-semibold text-slate-700">{value.toFixed(1)}</span>
      {count != null ? <span className="text-xs text-slate-500">({count})</span> : null}
    </span>
  );
}
