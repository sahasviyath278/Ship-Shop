"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ProductDto } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  stockQuantity: z.coerce.number().int().min(0),
  categoryId: z.string().uuid(),
  imageUrl: z.string().optional(), // single string for simplicity
});

type FormData = z.infer<typeof productSchema>;

export default function SellerDashboard() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<ProductDto[]>({
    queryKey: ["seller-products"],
    queryFn: () => api.get("/products?sellerOwn=true").then(r => r.data?.items ?? []),
    // Note: The backend GetProductsQuery can be filtered by sellerId automatically for sellers.
    // We'll assume the API returns only seller's products if role is Seller (already implemented in backend query).
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => api.post("/products", { ...data, imageUrls: data.imageUrl ? [data.imageUrl] : [] }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seller-products"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      api.put(`/products/${id}`, { ...data, imageUrls: data.imageUrl ? [data.imageUrl] : [] }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["seller-products"] }),
  });

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<FormData>({ resolver: zodResolver(productSchema) });

  const onSubmit = (data: FormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
    reset();
  };

  const startEdit = (product: ProductDto) => {
    setEditingId(product.id);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("stockQuantity", product.stockQuantity);
    setValue("categoryId", product.categoryId);
    setValue("imageUrl", product.imageUrls[0] || "");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <h2 className="font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>
        <input {...register("name")} placeholder="Name" className="w-full border p-2 rounded" />
        <textarea {...register("description")} placeholder="Description" className="w-full border p-2 rounded" />
        <input type="number" step="0.01" {...register("price")} placeholder="Price" className="w-full border p-2 rounded" />
        <input type="number" {...register("stockQuantity")} placeholder="Stock Quantity" className="w-full border p-2 rounded" />
        <input {...register("categoryId")} placeholder="Category Id (GUID)" className="w-full border p-2 rounded" />
        <input {...register("imageUrl")} placeholder="Image URL (optional)" className="w-full border p-2 rounded" />
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); reset(); }} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </form>

      {isLoading ? <p>Loading...</p> : (
        <div className="grid gap-4">
          {products?.map((p) => (
            <div key={p.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm">${p.price.toFixed(2)} - Stock: {p.stockQuantity}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => startEdit(p)} className="bg-yellow-400 px-3 py-1 rounded">Edit</button>
                <button onClick={() => deleteMutation.mutate(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}