import Link from "next/link";

export default function StatCard({ label, value, icon: Icon, href }) {
  const body = (
    <div className="flex items-start justify-between rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div>
        <p className="text-sm font-semibold text-slate-600">{label}</p>
        <p className="mt-1 font-display text-4xl font-bold">{value}</p>
      </div>
      {Icon ? <Icon size={22} className="text-slate-400" aria-hidden="true" /> : null}
    </div>
  );
  return href ? (
    <Link href={href} className="block rounded-xl transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">{body}</Link>
  ) : body;
}
