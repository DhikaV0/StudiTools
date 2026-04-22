"use client";

import { useEffect, useState } from "react";

type Tool = {
  id: string;
  name: string;
  stockTotal: number;
  stockAvailable: number;
  category?: { name: string };
};

export default function PeminjamDashboard() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchTools() {
    setLoading(true);
    const res = await fetch("/api/tools");
    const data = await res.json();

    if (data.success) {
      setTools(data.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTools();
  }, []);

  async function handleBorrow(toolId: string) {
    try {
      const res = await fetch("/api/borrowings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          returnDue: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // 3 hari
          notes: "Borrow from dashboard",
          items: [
            {
              toolId,
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Borrow request submitted");
    } catch (err) {
      console.error(err);
      alert("Failed to borrow");
    }
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Available Tools</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/5 rounded-xl p-5 space-y-3 border border-white/10"
            >
              <h2 className="text-lg font-semibold">
                {tool.name}
              </h2>

              {tool.category && (
                <p className="text-sm opacity-70">
                  Category: {tool.category.name}
                </p>
              )}

              <p className="text-sm">
                Stock Available:{" "}
                <span
                  className={
                    tool.stockAvailable > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {tool.stockAvailable}
                </span>
              </p>

              <button
                disabled={tool.stockAvailable <= 0}
                onClick={() => handleBorrow(tool.id)}
                className={`w-full mt-2 py-2 rounded ${
                  tool.stockAvailable > 0
                    ? "bg-cyan-600 hover:opacity-80"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Borrow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}