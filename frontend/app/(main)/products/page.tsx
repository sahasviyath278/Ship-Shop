"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "@/lib/axios";
import ProductCard from "@/components/ProductCard";
import { ProductDto } from "@/lib/types";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get("/categories");
        return res.data;
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        return [];
      }
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", search, category, sort, page],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get("/products", {
          params: {
            search,
            categoryId: category || undefined,
            sortBy: sort,
            page,
            pageSize: 12,
          },
        });
        return res.data;
      } catch (err) {
        console.error("Failed to fetch products:", err);
        throw err;
      }
    },
  });

  const hasNextPage = data?.items?.length === 12;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Categories</option>
          {categories?.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="name">Name</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Failed to load products. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      ) : data?.items?.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
          {data?.items?.map((product: ProductDto) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex justify-center items-center gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <span className="px-4 py-2 font-semibold">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
        </select>
      </div>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.items?.map((product: any) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 border">Prev</button>
        <span className="px-4 py-2">{page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={data && data.items.length < 12} className="px-4 py-2 border">Next</button>
      </div>
    </div>
  );
}