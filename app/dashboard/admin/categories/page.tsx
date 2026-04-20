"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchCategories();
      setLoading(false);
    }
    init();
  }, []);

  async function handleCreate() {
    if (!name) return;

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchCategories();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    fetchCategories();
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Categories Management</h1>

      <div className="bg-white/5 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Add New Category</h2>

        <div className="flex gap-4">
          <input
            placeholder="Category Name"
            className="p-2 rounded bg-white/10 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded hover:opacity-80"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-t border-white/10">
                  <td className="p-4">{cat.name}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(cat.id)}
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