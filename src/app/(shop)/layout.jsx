import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { homePathFor } from "@/lib/auth-rules";
import ShopFrame from "@/components/shop/ShopFrame";

// Halaman toko hanya untuk Guest dan Buyer. Seller/Admin selalu diarahkan ke dashboard masing-masing.
export default async function ShopLayout({ children }) {
  const user = await getCurrentUser();
  if (user && user.role !== "buyer") redirect(homePathFor(user));
  return <ShopFrame>{children}</ShopFrame>;
}
