"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useState } from "react";

interface UserDto {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery<UserDto[]>({
    queryKey: ["admin-users"],
    queryFn: () => api.get("/admin/users").then((r) => r.data),
  });

  const manageUser = useMutation({
    mutationFn: ({ id, isActive, role }: { id: string; isActive?: boolean; role?: string }) =>
      api.put(`/admin/users/${id}`, { isActive, role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (isLoading) return <p>Loading users...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.fullName}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.isActive ? "Active" : "Suspended"}</td>
              <td className="p-2 space-x-2">
                <select
                  value={user.role}
                  onChange={(e) => manageUser.mutate({ id: user.id, role: e.target.value })}
                  className="border p-1 rounded"
                >
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  onClick={() => manageUser.mutate({ id: user.id, isActive: !user.isActive })}
                  className={`px-2 py-1 rounded text-white ${user.isActive ? "bg-red-500" : "bg-green-500"}`}
                >
                  {user.isActive ? "Suspend" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}