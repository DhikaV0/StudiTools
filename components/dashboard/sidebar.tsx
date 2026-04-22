"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { sidebarConfig, Role } from "@/lib/config/sidebar";

export default function Sidebar() {
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("role");
    if (stored) {
      setRole(stored as Role);
    }
  }, []);

  if (!role) return null;

  const menus = sidebarConfig[role];

  return (
    <aside className="w-64 p-4 bg-white/5">
      {menus.map((item, i) => {
        const Icon = item.icon;
        return (
          <Link
            key={i}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded hover:bg-white/10"
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}