"use client";
import { useWishlistStore } from "@/store/wishlistStore";
import Link from "next/link";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <h1 className="text-3xl font-bold mb-4">My Wishlist</h1>
        <p className="text-gray-600 mb-6">Your wishlist is empty</p>
        <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.productId} className="border rounded-lg overflow-hidden shadow-lg">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.productName} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <Link href={`/products/${item.productId}`}>
                <h3 className="font-bold text-lg mb-2 hover:text-blue-600">{item.productName}</h3>
              </Link>
              <p className="text-2xl font-bold text-blue-600 mb-4">${item.price.toFixed(2)}</p>
              <div className="flex gap-2">
                <Link
                  href={`/products/${item.productId}`}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
                >
                  View
                </Link>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}