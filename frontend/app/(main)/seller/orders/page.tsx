"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { OrderDto } from "@/lib/types";

export default function SellerOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery<OrderDto[]>({
    queryKey: ["seller-orders"],
    queryFn: () => api.get("/orders").then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      api.patch(`/orders/${orderId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seller-orders"] }),
  });

  if (isLoading) return <p>Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders (containing my products)</h1>
      {orders?.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4 shadow">
          <div className="flex justify-between">
            <span>Order #{order.id.slice(0, 8)}</span>
            <span className={`capitalize font-semibold ${order.status === 'Cancelled' ? 'text-red-500' : 'text-green-600'}`}>
              {order.status}
            </span>
          </div>
          <ul>
            {order.items.filter(i => {
              // In real app you’d check sellerId, but for simplicity show all items.
              return true;
            }).map((item) => (
              <li key={item.productId} className="text-sm">{item.productName} x {item.quantity} @ ${item.unitPrice}</li>
            ))}
          </ul>
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <div className="mt-2 space-x-2">
              {order.status === 'Pending' && (
                <button onClick={() => updateStatus.mutate({ orderId: order.id, status: 'Processing' })} className="bg-blue-500 text-white px-3 py-1 rounded">
                  Mark Processing
                </button>
              )}
              {order.status === 'Processing' && (
                <button onClick={() => updateStatus.mutate({ orderId: order.id, status: 'Shipped' })} className="bg-green-600 text-white px-3 py-1 rounded">
                  Mark Shipped
                </button>
              )}
              {order.status === 'Shipped' && (
                <button onClick={() => updateStatus.mutate({ orderId: order.id, status: 'Delivered' })} className="bg-purple-600 text-white px-3 py-1 rounded">
                  Mark Delivered
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}