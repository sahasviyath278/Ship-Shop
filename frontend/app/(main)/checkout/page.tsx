"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cartStore";
import { getApi } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  shippingAddress: z.string().min(10, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  paymentMethod: z.enum(["credit_card", "debit_card", "bank_transfer"], {
    errorMap: () => ({ message: "Select a payment method" }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const api = getApi();
      const res = await api.post("/orders", {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        shippingAddress: `${data.shippingAddress}, ${data.city}, ${data.postalCode}`,
        paymentMethod: data.paymentMethod,
        totalAmount: total,
      });

      clearCart();
      router.push(`/orders`);
      alert("Order placed successfully!");
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Checkout failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
            <a href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full border border-gray-300 p-2 rounded bg-gray-100"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea
                    {...register("shippingAddress")}
                    placeholder="123 Main St, Apt 4B"
                    rows={3}
                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {errors.shippingAddress && (
                    <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      {...register("city")}
                      placeholder="New York"
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      {...register("postalCode")}
                      placeholder="10001"
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                <div className="space-y-3">
                  {["credit_card", "debit_card", "bank_transfer"].map((method) => (
                    <label key={method} className="flex items-center border rounded p-3 cursor-pointer hover:bg-gray-50">
                      <input type="radio" {...register("paymentMethod")} value={method} className="mr-3" />
                      <span className="capitalize">
                        {method.replace("_", " ")}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-2">{errors.paymentMethod.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 font-bold transition"
              >
                {loading ? "Processing..." : `Complete Purchase ($${total.toFixed(2)})`}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6 pb-6 border-b">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.productName} x {item.quantity}</span>
                  <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}