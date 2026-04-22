"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  pending: number;
  active: number;
  returned: number;
};

export default function PetugasDashboard() {
  const [stats, setStats] = useState<Stats>({ pending: 0, active: 0, returned: 0 });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/borrowings");
      const json = await res.json();
  
      if (json.success) {
        // Pastikan mengambil array-nya saja
        const list = json.data.data || json.data; 
      
        if (Array.isArray(list)) {
          setStats({
            pending: list.filter((b: any) => b.status === "PENDING").length,
            active: list.filter((b: any) => b.status === "APPROVED").length,
            returned: list.filter((b: any) => b.status === "RETURNED").length,
          });
        }
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-2xl font-bold">Dashboard Petugas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Menunggu Persetujuan" value={stats.pending} color="border-yellow-500" />
        <Card title="Sedang Dipinjam" value={stats.active} color="border-cyan-500" />
        <Card title="Sudah Kembali" value={stats.returned} color="border-green-500" />
      </div>

      <div className="flex gap-4">
        <Link href="/dashboard/petugas/borrowings" className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-lg transition">
          Kelola Peminjaman
        </Link>
      </div>
    </div>
  );
}

function Card({ title, value, color }: any) {
  return (
    <div className={`bg-white/5 p-6 rounded-xl border-l-4 ${color}`}>
      <p className="text-sm opacity-70 uppercase tracking-wider">{title}</p>
      <h2 className="text-4xl font-bold mt-2">{value}</h2>
    </div>
  );
}