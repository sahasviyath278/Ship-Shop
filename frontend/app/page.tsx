"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to E-Marketplace
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-4">
          Discover amazing products from trusted sellers
        </p>
        <p className="text-lg text-gray-500 mb-12">
          {user ? `Welcome back, ${user.fullName}!` : "Sign up or login to get started"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/products"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition inline-block"
          >
            Browse Products
          </Link>
          {!user && (
            <>
              <Link
                href="/login"
                className="bg-gray-200 text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold transition inline-block"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-semibold transition inline-block"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🛍️</div>
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p className="text-gray-600">Browse thousands of products from multiple sellers</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">Trusted Sellers</h3>
            <p className="text-gray-600">All sellers are verified and rated by our community</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
          </div>
        </div>
      </div>
    </div>
  );
}
