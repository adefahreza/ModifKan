import { User } from "lucide-react";
import { requireRole } from "@/lib/auth";
import ShopFrame from "@/components/shop/ShopFrame";
import AccountNav from "./AccountNav";

// Semua halaman akun tampil di dalam satu kotak dengan tab di bagian atas.
export default async function AccountLayout({ children }) {
  const user = await requireRole("buyer");
  return (
    <ShopFrame>
      <p className="mb-3 flex items-center gap-2 text-xl font-bold text-slate-900">
        <User size={22} aria-hidden="true" className="text-slate-400" /> {user.name.split(" ")[0]}
      </p>
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
        <AccountNav />
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </ShopFrame>
  );
}
