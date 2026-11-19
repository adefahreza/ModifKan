import { Check } from "lucide-react";
import { STATUS_LABELS } from "@/lib/order-rules";
import Badge from "@/components/ui/Badge";

const TONES = {
  menunggu_pembayaran: "amber",
  diproses: "blue",
  dikirim: "violet",
  selesai: "emerald",
  dibatalkan: "slate",
};

export default function StatusBadge({ status }) {
  return (
    <Badge tone={TONES[status] ?? "slate"}>
      {status === "selesai" ? <Check size={12} aria-hidden="true" /> : null}
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
