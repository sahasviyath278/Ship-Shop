"use client";
import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductDto } from "@/lib/types";

interface ProductCardProps {
  product: ProductDto;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      addItem({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        imageUrl: product.imageUrls?.[0],
      });
      setQuantity(1);
      alert(`Added ${quantity} ${product.name} to cart`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-48 w-full bg-gray-200">
          {product.imageUrls?.[0] ? (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.stockQuantity === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg truncate hover:text-blue-600">{product.name}</h3>
        </Link>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>

        <div className="flex justify-between items-center mb-2">
          <span className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          {product.averageRating > 0 && (
            <div className="text-sm">
              <span className="text-yellow-500">★</span>
              <span className="ml-1">{product.averageRating.toFixed(1)} ({product.reviewCount})</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mb-3">by {product.sellerName}</p>

        {product.stockQuantity > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={product.stockQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stockQuantity))}
                className="w-16 border rounded px-2 py-1 text-center"
              />
              <span className="text-sm text-gray-600">/ {product.stockQuantity} available</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ) : (
          <button disabled className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}