import Link from "next/link";
import { Heart, LayoutDashboard, LayoutGrid, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { homePathFor } from "@/lib/auth-rules";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import CartBadge from "./CartBadge";

const iconLink = "relative inline-flex size-11 items-center justify-center rounded-lg text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500";

export default function Navbar({ user, cartCount = 0 }) {
  const isBuyer = user?.role === "buyer";
  return (
    <header>
      <div className="hidden bg-slate-950 py-1.5 text-center text-xs text-slate-400 lg:block">
        Gratis daftar sebagai seller · Verifikasi oleh admin
      </div>
      <div className="bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/" aria-label="ModifKan beranda" className="mr-auto lg:mr-0"><Logo size="md" /></Link>

          <Link href="/products" className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white hover:bg-slate-800 lg:inline-flex">
            <LayoutGrid size={18} aria-hidden="true" /> Kategori
          </Link>

          <form action="/products" method="get" role="search" className="order-last flex w-full lg:order-none lg:flex-1">
            <input
              type="search" name="q" placeholder="Cari part, velg, knalpot…" aria-label="Cari produk"
              className="min-h-11 min-w-0 flex-1 rounded-l-lg bg-white px-3 text-base text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            />
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-r-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
              <Search size={18} aria-hidden="true" /><span className="hidden sm:inline">Cari</span>
            </button>
          </form>

          <Link href="/account/wishlist" aria-label="Wishlist" className={`${iconLink} hidden lg:inline-flex`}><Heart size={22} /></Link>
          <Link href="/cart" aria-label="Keranjang" className={iconLink}>
            <ShoppingCart size={22} />
            <CartBadge initial={cartCount} />
          </Link>

          {!user ? (
            <div className="flex items-center gap-2">
              <Button as={Link} href="/login" variant="ghost" size="md" className="text-white hover:bg-slate-800">Masuk</Button>
              <Button as={Link} href="/register" size="md">Daftar</Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {isBuyer ? (
                <Link href="/account" className="hidden min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white hover:bg-slate-800 lg:inline-flex">
                  <User size={18} aria-hidden="true" /> {user.name.split(" ")[0]}
                </Link>
              ) : (
                <Link href={homePathFor(user)} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-white hover:bg-slate-800">
                  <LayoutDashboard size={18} aria-hidden="true" /> Dashboard
                </Link>
              )}
              <form action={logoutAction}>
                <button type="submit" aria-label="Keluar" className={iconLink}><LogOut size={20} /></button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
