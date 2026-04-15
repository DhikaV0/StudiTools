"use client";

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-navy text-white p-6">
        <h2 className="text-xl font-semibold mb-8">
          Studio Tools
        </h2>

        <nav className="space-y-4">
            <Link href="/dashboard/admin">Dashboard</Link>
            <Link href="/dashboard/admin/users">Manajemen User</Link>
            <Link href="/dashboard/admin/tools">Manajemen Alat</Link>
            <Link href="/dashboard/admin/borrowings">Approval Peminjaman</Link>
        </nav>
      </aside>

      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}