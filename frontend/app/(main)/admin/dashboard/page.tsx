"use client";
import { useQuery } from "@tanstack/react-query";
import { getApi } from "@/lib/axios";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get("/admin/stats");
        return res.data;
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        return {};
      }
    },
  });

  const { data: users } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get("/admin/users");
        return res.data || [];
      } catch (err) {
        console.error("Failed to fetch users:", err);
        return [];
      }
    },
    enabled: activeTab === "users",
  });

  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      try {
        const api = getApi();
        const res = await api.get("/admin/orders");
        return res.data || [];
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        return [];
      }
    },
    enabled: activeTab === "orders",
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-4 mb-6 border-b">
        {["overview", "users", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold capitalize ${
              activeTab === tab ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Total Users</p>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Total Orders</p>
            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">${stats?.totalRevenue?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-2">Total Products</p>
            <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.fullName}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{order.id}</td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 font-semibold">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}