"use client";

import { useEffect, useState } from "react";

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
  returnDate?: string | null;
  items: BorrowItem[];
};

export default function AdminReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchReports() {
    setLoading(true);

    const params = new URLSearchParams({
      startDate,
      endDate,
      status,
    });

    const res = await fetch(`/api/reports?${params}`);
    const data = await res.json();

    if (data.success) {
      setBorrowings(data.data);
    } else {
      setBorrowings([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  function exportExcel() {
    const params = new URLSearchParams({
      type: "excel",
      startDate,
      endDate,
      status,
    });

    window.open(`/api/reports/export?${params}`, "_blank");
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Reports</h1>

      {/* FILTER */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="text-xs">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white/10 px-3 py-2 rounded block"
          />
        </div>

        <div>
          <label className="text-xs">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white/10 px-3 py-2 rounded block"
          />
        </div>

        <div>
          <label className="text-xs">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white/10 px-3 py-2 rounded block"
          >
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <button
          onClick={fetchReports}
          className="bg-cyan-500 px-4 py-2 rounded"
        >
          Apply Filter
        </button>

        <button
          onClick={exportExcel}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {/* TABLE */}
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
                <th className="p-4 text-left">Return Date</th>
                <th className="p-4 text-left">Status</th>
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

                  <td className="p-4">
                    {b.returnDate
                      ? new Date(b.returnDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}