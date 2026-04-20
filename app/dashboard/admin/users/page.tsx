"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  username: string;
  role: "ADMIN" | "PETUGAS" | "PEMINJAM";
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "PEMINJAM",
  });

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate() {
    if (!form.name || !form.username || !form.password) return;

    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      username: "",
      password: "",
      role: "PEMINJAM",
    });

    fetchUsers();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Users Management</h1>

      {/* Create Form */}
      <div className="bg-white/5 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Add New User</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            placeholder="Name"
            className="p-2 rounded bg-white/10"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            placeholder="Username"
            className="p-2 rounded bg-white/10"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-white/10"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          <select
            className="p-2 rounded bg-white/10"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as any })
            }
          >
            <option value="ADMIN">ADMIN</option>
            <option value="PETUGAS">PETUGAS</option>
            <option value="PEMINJAM">PEMINJAM</option>
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded hover:opacity-80"
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Username</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">Created At</th>
                <th className="text-right p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.username}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-400 hover:opacity-70"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}