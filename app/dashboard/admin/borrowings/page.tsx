"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

type BorrowItem = {
  tool: { name: string };
  quantity: number;
};

type Borrowing = {
  id: string;
  user: { name: string };
  status: string;
  borrowDate: string;
  returnDue: string;
  items: BorrowItem[];
};

export default function AdminBorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBorrowings() {
    const res = await fetch("/api/borrowings");
    const data = await res.json();
  
    console.log("API Response:", data);
  
    if (data.success) {
      // kalau service return { data, total }
      if (Array.isArray(data.data)) {
        setBorrowings(data.data);
      } else if (Array.isArray(data.data?.data)) {
        setBorrowings(data.data.data);
      } else {
        setBorrowings([]);
      }
    }
  }

  useEffect(() => {
    async function init() {
      setLoading(true);
      await fetchBorrowings();
      setLoading(false);
    }
    init();
  }, []);

  async function updateStatus(id: string, action: "APPROVE" | "REJECT" | "RETURN") {
    try {
      await fetch("/api/borrowings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          borrowingId: id,
        }),
      });
  
      fetchBorrowings();
    } catch (err) {
      console.error("Update error:", err);
    }
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Borrowings Management</h1>

      <div className="bg-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Items</th>
                <th className="p-4 text-left">Borrow Date</th>
                <th className="p-4 text-left">Return Due</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="p-4">{b.user.name}</td>

                  <td className="p-4">
                    {b.items.map((item, i) => (
                      <div key={i}>
                        {item.tool.name} ({item.quantity})
                      </div>
                    ))}
                  </td>

                  <td className="p-4">
                    {new Date(b.borrowDate).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {new Date(b.returnDue).toLocaleDateString()}
                  </td>

                  <td className="p-4">{b.status}</td>

                  <td className="p-4 text-right space-x-2">
                    {b.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => updateStatus(b.id, "APPROVE")}
                          className="text-cyan-400"
                        >
                          <CheckCircle size={16} />
                        </button>
                    
                        <button
                          onClick={() => updateStatus(b.id, "REJECT")}
                          className="text-red-400"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                    {b.status === "APPROVED" && (
                      <button
                        onClick={() => updateStatus(b.id, "RETURN")}
                        className="text-green-400"
                      >
                        <RotateCcw size={16} />
                      </button>
                    )}
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