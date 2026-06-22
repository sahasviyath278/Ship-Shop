"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/" className="font-bold text-lg hover:text-gray-300">
          E-Marketplace
        </Link>
        <div className="space-x-4">
          <Link href="/products" className="hover:text-gray-300">Products</Link>
          {user?.role === "Buyer" && (
            <>
              <Link href="/cart" className="hover:text-gray-300">Cart ({cartCount})</Link>
              <Link href="/wishlist" className="hover:text-gray-300">Wishlist ({wishlistCount})</Link>
              <Link href="/orders" className="hover:text-gray-300">My Orders</Link>
            </>
          )}
          {user?.role === "Seller" && (
            <>
              <Link href="/seller/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link href="/seller/orders" className="hover:text-gray-300">Orders</Link>
            </>
          )}
          {user?.role === "Admin" && (
            <>
              <Link href="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link href="/admin/users" className="hover:text-gray-300">Users</Link>
              <Link href="/admin/orders" className="hover:text-gray-300">Orders</Link>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <div className="text-sm">
              <span className="font-semibold">{user.fullName}</span>
              <span className="ml-2 text-gray-400">({user.role})</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
            <Link href="/register" className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded transition">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}