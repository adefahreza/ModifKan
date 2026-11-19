import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

export default async function ShopFrame({ children }) {
  const user = await getCurrentUser();
  const cartCount = user?.role === "buyer" ? (await query("cart/count", [user.id])).rows[0].count : 0;
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Navbar user={user} cartCount={cartCount} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">{children}</main>
      <Footer showSellerLink={!user} />
      <BottomNav />
    </div>
  );
}
