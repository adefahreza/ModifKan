import { formatDate, formatOrderNumber, formatRupiah } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

// party: { label, name, phone? } — pihak lain dari sudut pandang yang melihat (toko atau pembeli).
export default function OrderSummary({ order, party }) {
  const hasAddress = order.shipping_address != null;
  return (
    <section className="space-y-4 rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-slate-900">{formatOrderNumber(order.id)}</h1>
          <p className="text-xs text-slate-500">
            Dibuat {formatDate(order.created_at)} · Diperbarui {formatDate(order.updated_at)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">{party.label}</dt>
          <dd className="font-semibold text-slate-900">{party.name}</dd>
          {party.phone ? <dd className="text-slate-700">{party.phone}</dd> : null}
        </div>
        <div>
          <dt className="text-slate-500">Total</dt>
          <dd className="font-display text-xl font-bold text-slate-900">{formatRupiah(order.total)}</dd>
        </div>
        {hasAddress ? (
          <div className="sm:col-span-2">
            <dt className="text-slate-500">Alamat pengiriman</dt>
            <dd className="text-slate-900">
              <span className="font-semibold">{order.shipping_recipient}</span> · {order.shipping_phone}
              <br />
              {order.shipping_address}, {order.shipping_city} {order.shipping_postal_code}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
