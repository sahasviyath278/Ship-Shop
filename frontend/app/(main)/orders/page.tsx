"use client";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "@/lib/axios";
import Link from "next/link";
import { OrderDto } from "@/lib/types";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery<OrderDto[]>({
    queryKey: ["my-orders"],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get("/orders");
        return res.data || [];
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        throw err;
      }
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Failed to load orders. Please try again.
        </div>
      )}

      {isLoading ? (
        <p>Loading orders...</p>
      ) : orders?.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                  <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Items:</p>
                {order.items?.map((item) => (
                  <p key={item.productId} className="text-sm">
                    {item.productName} x {item.quantity} @ ${item.unitPrice.toFixed(2)}
                  </p>
                ))}
              </div>

              <div className="border-t mt-4 pt-4">
                <p className="text-sm">
                  <strong>Shipping Address:</strong> {order.shippingAddress}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Ordered on {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}