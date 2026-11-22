import Link from "next/link";

export default function FilterChips({ options, param = "status", current, basePath = "", extra = {} }) {
  const hrefFor = (value) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(extra)) if (v) sp.set(k, v);
    if (value !== "") sp.set(param, value);
    const qs = sp.toString();
    return `${basePath}${qs ? `?${qs}` : ""}` || "?";
  };
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:mx-0 sm:px-0" role="tablist">
      {options.map((o) => {
        const active = o.value === current;
        return (
          <Link key={o.value} href={hrefFor(o.value)} scroll={false}
            aria-current={active ? "true" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${active ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-100"}`}>
            {o.label}
            {o.count !== undefined ? <span className={`text-xs ${active ? "text-slate-300" : "text-slate-500"}`}>{o.count}</span> : null}
          </Link>
        );
      })}
    </div>
  );
}
