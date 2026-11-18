import { requireRole } from "@/lib/auth";
import ShopFrame from "@/components/shop/ShopFrame";
import AccountNav from "./AccountNav";

export default async function AccountLayout({ children }) {
  await requireRole("buyer");
  return (
    <ShopFrame>
      <AccountNav />
      {children}
    </ShopFrame>
  );
}
