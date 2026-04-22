"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, XCircle, RotateCcw, Package } from "lucide-react";

export default function MyBorrowingsPage() {
  const [borrowings, setBorrowings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/borrowings");
      const data = await res.json();
      if (data.success) {
        setBorrowings(data.data.data || data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><Clock size={12}/> Pending</span>;
      case "APPROVED":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20"><CheckCircle size={12}/> Sedang Dipinjam</span>;
      case "RETURNED":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"><Package size={12}/> Dikembalikan</span>;
      case "REJECTED":
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20"><XCircle size={12}/> Ditolak</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 text-white max-w-5xl mx-auto p-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Peminjaman</h1>
        <p className="text-white/50 text-sm">Pantau status dan kelola pengembalian alat Anda.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-white/40">Memuat data...</div>
        ) : borrowings.length === 0 ? (
          <div className="p-12 text-center text-white/40 italic">Belum ada riwayat peminjaman.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 border-b border-white/10 text-white/70 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-5">Informasi Alat</th>
                  <th className="p-5 text-center">Tanggal Pinjam</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {borrowings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <div className="font-medium text-white">
                        {b.items?.map((i: any) => i.toolNameSnapshot || i.tool?.name).join(", ") || "Alat tidak diketahui"}
                      </div>
                      <div className="text-[11px] text-white/40 mt-1 uppercase tracking-tighter">ID: {b.id.slice(0, 8)}</div>
                    </td>
                    <td className="p-5 text-center text-white/70">
                      {new Date(b.borrowDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="p-5">
                      <div className="flex justify-center uppercase">
                        {getStatusBadge(b.status)}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      {b.status === "APPROVED" && (
                    <button 
                      onClick={() => handleReturn(b)}
                      className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition-colors"
                    >
                      Kembalikan
                    </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}