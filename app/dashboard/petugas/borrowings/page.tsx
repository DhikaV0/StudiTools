"use client";

import { useEffect, useState } from "react";

export default function PetugasBorrowingsPage() {
  const [borrowings, setBorrowings] = useState<any[]>([]);

// app/dashboard/petugas/borrowings/page.tsx

async function fetchData() {
  try {
    const res = await fetch("/api/borrowings");
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Server Error");
    }

    const json = await res.json();

    if (json.success) {
      const list = json.data?.data || (Array.isArray(json.data) ? json.data : []);
      console.log("Data diterima:", list);
      setBorrowings(list);
    }
  } catch (error: any) {
    console.error("Fetch error details:", error.message);
  }
}

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk Approve & Reject (Tetap menggunakan PATCH)
  async function updateStatus(id: string, action: string) {
    try {
      const res = await fetch("/api/borrowings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, borrowingId: id }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      
      alert(`Berhasil melakukan ${action}`);
      fetchData();
    } catch (error: any) {
      alert(`Gagal: ${error.message}`);
    }
  }

  async function handleReturn(borrowing: any) {
    const payload = {
      borrowingId: borrowing.id,
      notes: "Dikembalikan dan diproses oleh Petugas",
      items: borrowing.items.map((item: any) => ({
        toolId: item.toolId,
        quantityReturned: item.quantity,
        conditionAfter: "GOOD", 
      })),
    };

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!data.success) throw new Error(data.message);
      
      if (data.fine > 0) {
        alert(`Pengembalian berhasil. Terdapat denda sebesar Rp ${data.fine}`);
      } else {
        alert("Pengembalian berhasil tanpa denda.");
      }
      
      fetchData();
    } catch (error: any) {
      alert(`Gagal memproses pengembalian: ${error.message}`);
    }
  }

  return (
    <div className="space-y-6 text-white">
      <h1 className="text-xl font-bold">Borrowing Management</h1>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Item(s)</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {borrowings.map((b) => (
              <tr key={b.id} className="bg-white/5 hover:bg-white/10 transition-colors">
                <td className="p-4">{b.user.name}</td>
                <td className="p-4">
                  {b.items?.map((i: any) => i.toolNameSnapshot || i.tool?.name || "Alat tidak diketahui").join(", ")}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    b.status === "PENDING" ? "bg-yellow-500/20 text-yellow-300" :
                    b.status === "APPROVED" ? "bg-blue-500/20 text-blue-300" :
                    b.status === "RETURNED" ? "bg-green-500/20 text-green-300" :
                    "bg-red-500/20 text-red-300"
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  {b.status === "PENDING" && (
                    <>
                      <button 
                        onClick={() => updateStatus(b.id, "APPROVE")}
                        className="bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(b.id, "REJECT")}
                        className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {b.status === "APPROVED" && (
                    <button 
                      onClick={() => handleReturn(b)}
                      className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition-colors"
                    >
                      Process Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}