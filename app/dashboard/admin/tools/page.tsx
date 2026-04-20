"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Tool = {
  id: string;
  name: string;
  description?: string;
  stockTotal: number;
  stockAvailable: number;
  condition: string;
  category: Category;
  createdAt: string;
};

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    stockTotal: 0,
    condition: "GOOD",
  });

  async function fetchTools() {
    const res = await fetch("/api/tools");
    const data = await res.json();
    if (data.success) {
      setTools(data.data);
    }
  }

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
      await fetchTools();
      setLoading(false);
    }
    init();
  }, []);

  async function handleCreate() {
    if (!form.name || !form.categoryId) return;

    await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        stockAvailable: form.stockTotal,
      }),
    });

    setForm({
      name: "",
      description: "",
      categoryId: "",
      stockTotal: 0,
      condition: "GOOD",
    });

    fetchTools();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/tools/${id}`, {
      method: "DELETE",
    });

    fetchTools();
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Tools Management</h1>

      {/* Create Tool */}
      <div className="bg-white/5 p-6 rounded-xl space-y-4">
        <h2 className="text-lg font-semibold">Add New Tool</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Tool Name"
            className="p-2 rounded bg-white/10"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            placeholder="Description"
            className="p-2 rounded bg-white/10"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            className="p-2 rounded bg-white/10"
            value={form.categoryId}
            onChange={(e) =>
              setForm({ ...form, categoryId: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Stock Total"
            className="p-2 rounded bg-white/10"
            value={form.stockTotal}
            onChange={(e) =>
              setForm({ ...form, stockTotal: Number(e.target.value) })
            }
          />

          <input
            placeholder="Condition"
            className="p-2 rounded bg-white/10"
            value={form.condition}
            onChange={(e) =>
              setForm({ ...form, condition: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded hover:opacity-80"
        >
          <Plus size={16} />
          Add Tool
        </button>
      </div>

      {/* Tools Table */}
      <div className="bg-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Condition</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr
                  key={tool.id}
                  className="border-t border-white/10"
                >
                  <td className="p-4">{tool.name}</td>
                  <td className="p-4">{tool.category?.name}</td>
                  <td className="p-4">
                    {tool.stockAvailable} / {tool.stockTotal}
                  </td>
                  <td className="p-4">{tool.condition}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(tool.id)}
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