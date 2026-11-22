export default function EmptyState({ icon: Icon, title, description, action, className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 rounded-xl bg-white px-6 py-14 text-center ring-1 ring-slate-200 ${className}`}>
      {Icon ? <Icon size={40} className="text-slate-400" aria-hidden="true" /> : null}
      <p className="font-semibold text-slate-900">{title}</p>
      {description ? <p className="max-w-sm text-sm text-slate-600">{description}</p> : null}
      {action ?? null}
    </div>
  );
}
