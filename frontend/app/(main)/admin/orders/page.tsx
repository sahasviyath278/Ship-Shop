"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { OrderDto } from "@/lib/types";

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery<OrderDto[]>({
    queryKey: ["admin-orders"],
    queryFn: () => api.get("/orders?all=true").then((r) => r.data), // need to pass all flag or separate admin endpoint
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      api.patch(`/orders/${orderId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  if (isLoading) return <p>Loading all orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders?.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4 shadow">
          <div className="flex justify-between">
            <span>Order #{order.id.slice(0, 8)} by {order.items[0]?.productName ? "..." : ""}</span>
            <span className={`capitalize font-semibold ${order.status === 'Cancelled' ? 'text-red-500' : 'text-green-600'}`}>
              {order.status}
            </span>
          </div>
          <div className="text-sm">Total: ${order.totalAmount.toFixed(2)}</div>
          {order.status !== 'Cancelled' && (
            <button onClick={() => updateStatus.mutate({ orderId: order.id, status: 'Cancelled' })} className="mt-2 bg-red-600 text-white px-3 py-1 rounded">
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
}