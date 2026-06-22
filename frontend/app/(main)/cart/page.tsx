"use client";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const router = useRouter();

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>
      {items.length === 0 ? <p>Your cart is empty.</p> :
        items.map(item => (
          <div key={item.productId} className="flex justify-between items-center border p-2 my-2">
            <span>{item.productName} - ${item.unitPrice.toFixed(2)}</span>
            <div className="flex gap-2">
              <input type="number" min={1} value={item.quantity} onChange={e => updateQuantity(item.productId, +e.target.value)} className="w-16 border p-1" />
              <button onClick={() => removeItem(item.productId)} className="text-red-500">Remove</button>
            </div>
          </div>
        ))
      }
      <div className="text-right font-bold">Total: ${total.toFixed(2)}</div>
      <button onClick={() => router.push("/checkout")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" disabled={items.length === 0}>Proceed to Checkout</button>
    </div>
  );
}