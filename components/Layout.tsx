// DashboardLayoutSimple.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  BookOpen,
  BarChart3,
  LogOut,
} from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Equipment", href: "/dashboard/admin/equipment", icon: Package },
    { name: "Borrowings", href: "/dashboard/admin/borrowings", icon: BookOpen },
    { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shadow-xl" style={{ backgroundColor: `var(--color-navy)` }}>
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: `rgba(74,78,137,0.3)` }}>
          <div className="flex items-center gap-2">
            <Image
              src="/StudioTools.png"
              alt="Studio Tools"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h2 className="text-lg font-bold" style={{ color: `var(--color-cyan)` }}>
                Studio Admin
              </h2>
              <p className="text-xs" style={{ color: `var(--color-warm)` }}>
                Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r shadow-md" 
                    : "hover:bg-white/5"
                  }
                `}
                style={isActive ? { 
                  background: `linear-gradient(90deg, var(--color-urban), transparent)`,
                  borderLeft: `3px solid var(--color-cyan)`
                } : {}}
              >
                <Icon 
                  size={18} 
                  style={{ color: isActive ? `var(--color-cyan)` : `rgba(255,255,255,0.6)` }}
                />
                <span 
                  className="text-sm"
                  style={{ color: isActive ? `white` : `rgba(255,255,255,0.7)` }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: `rgba(74,78,137,0.3)` }}>
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all hover:bg-white/5"
            onClick={() => window.location.href = "/login"}
          >
            <LogOut size={18} style={{ color: `var(--color-neon)` }} />
            <span className="text-sm" style={{ color: `rgba(255,255,255,0.7)` }}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-auto" style={{ backgroundColor: `var(--color-navy)` }}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

