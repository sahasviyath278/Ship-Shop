"use client";
import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApi } from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";
import { ProductDto, ReviewDto } from "@/lib/types";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get(`/products/${id}`);
        return res.data as ProductDto;
      } catch (err) {
        console.error("Failed to fetch product:", err);
        throw err;
      }
    },
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get(`/products/${id}/reviews`);
        return res.data as ReviewDto[];
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        return [];
      }
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const api = getApi();
      return api.post(`/products/${id}/reviews`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", id] });
      setRating(5);
      setComment("");
      alert("Review submitted successfully!");
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Failed to submit review");
    },
  });

  if (productLoading) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <p className="mb-4">Product not found</p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="container mx-auto p-4">
      <Link href="/products" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          {product.imageUrls?.[0] && (
            <Image
              src={product.imageUrls[0]}
              alt={product.name}
              width={500}
              height={500}
              className="w-full rounded-lg"
            />
          )}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.imageUrls?.slice(1, 5).map((url, idx) => (
              <Image key={idx} src={url} alt="Product" width={100} height={100} className="rounded cursor-pointer" />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
            {product.averageRating > 0 && (
              <div className="text-sm">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">
                  {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">by {product.sellerName}</p>

          <div className="mb-6 p-4 bg-gray-50 rounded">
            <p className="mb-2">
              <strong>Stock:</strong> {product.stockQuantity > 0 ? `${product.stockQuantity} available` : "Out of Stock"}
            </p>
            <p>
              <strong>Category:</strong> {product.categoryName}
            </p>
          </div>

          {product.stockQuantity > 0 && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stockQuantity))}
                  className="w-16 border rounded px-2 py-1 text-center"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addItem({
                      productId: product.id,
                      productName: product.name,
                      unitPrice: product.price,
                      quantity,
                      imageUrl: product.imageUrls?.[0],
                    });
                    alert(`Added ${quantity} ${product.name} to cart`);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    if (inWishlist) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist({
                        productId: product.id,
                        productName: product.name,
                        price: product.price,
                        imageUrl: product.imageUrls?.[0],
                      });
                    }
                  }}
                  className={`px-4 py-3 rounded font-semibold ${
                    inWishlist
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  ♥
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          {reviewsLoading ? (
            <p>Loading reviews...</p>
          ) : reviews?.length === 0 ? (
            <p className="text-gray-600">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {reviews?.map((review) => (
                <div key={review.id} className="border-l-4 border-yellow-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{review.userName}</span>
                    <span className="text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </span>
                  </div>
                  {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitReviewMutation.mutate({ rating, comment });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-semibold mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="5">★★★★★ Excellent</option>
                  <option value="4">★★★★☆ Good</option>
                  <option value="3">★★★☆☆ Average</option>
                  <option value="2">★★☆☆☆ Poor</option>
                  <option value="1">★☆☆☆☆ Terrible</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={submitReviewMutation.isPending}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400 font-semibold"
              >
                {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}