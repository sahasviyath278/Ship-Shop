"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.enum(["Buyer", "Seller"]),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post("/auth/register", data);
      setAuth(res.data);
      router.push("/products");
    } catch (err: any) {
      alert(err.response?.data?.errors || "Registration failed");
    }
  };

  return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("fullName")} placeholder="Full Name" className="w-full border p-2 rounded" />
          {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
          <input {...register("email")} placeholder="Email" className="w-full border p-2 rounded" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <input type="password" {...register("password")} placeholder="Password" className="w-full border p-2 rounded" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          <select {...register("role")} className="w-full border p-2 rounded">
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
  );
}