import { Ban } from "lucide-react";
import { TIMELINE_STEPS, timelineIndex } from "@/lib/order-rules";

export default function OrderTimeline({ status }) {
  const current = timelineIndex(status);

  if (current === -1) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
        <Ban size={18} aria-hidden="true" /> Pesanan dibatalkan
      </p>
    );
  }

  return (
    <ol aria-label="Status pesanan" className="grid grid-cols-4 rounded-xl bg-white px-2 py-4 ring-1 ring-slate-200">
      {TIMELINE_STEPS.map((label, i) => {
        const done = i <= current;
        return (
          <li key={label} aria-current={i === current ? "step" : undefined} className="relative flex flex-col items-center gap-2 text-center">
            {i > 0 ? (
              <span aria-hidden="true" className={`absolute right-1/2 top-2 h-0.5 w-full -translate-y-1/2 ${done ? "bg-red-600" : "bg-slate-200"}`} />
            ) : null}
            <span aria-hidden="true" className={`relative z-10 size-4 rounded-full ring-4 ring-white ${done ? "bg-red-600" : "bg-slate-300"}`} />
            <span className={`text-xs font-semibold leading-tight sm:text-sm ${done ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
