// Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  BookOpen,
  BarChart3,
  Bookmark,
  LogOut,
  Settings,
  ChevronRight,
  Camera,
  Mic,
  Sun,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Role = "ADMIN" | "PETUGAS" | "PEMINJAM";

type Props = {
  role: Role;
};

export default function Sidebar({ role }: Props) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuByRole: Record<Role, any[]> = {
    ADMIN: [
      { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
      { name: "Users", href: "/dashboard/admin/users", icon: Users },
      { name: "Category", href: "/dashboard/admin/categories", icon: Bookmark },
      { name: "Tools", href: "/dashboard/admin/tools", icon: Package },
      { name: "Borrowings", href: "/dashboard/admin/borrowings", icon: BookOpen },
      { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
    ],
    PETUGAS: [
      { name: "Dashboard", href: "/dashboard/petugas", icon: LayoutDashboard },
      { name: "Borrowings", href: "/dashboard/petugas/borrowings", icon: BookOpen },
      { name: "Reports", href: "/dashboard/petugas/reports", icon: BarChart3 },
    ],
    PEMINJAM: [
      { name: "Dashboard", href: "/dashboard/peminjam", icon: LayoutDashboard },
      { name: "My Borrowings", href: "/dashboard/peminjam/borrowings", icon: BookOpen },
    ],
  };

  // Helper function to check if route is active
  const isRouteActive = (href: string) => {
    if (href === "/dashboard/admin" && pathname === "/dashboard/admin") {
      return true;
    }
    if (href === "/dashboard/petugas" && pathname === "/dashboard/petugas") {
      return true;
    }
    if (href === "/dashboard/peminjam" && pathname === "/dashboard/peminjam") {
      return true;
    }
    // For nested routes (e.g., /dashboard/admin/users matches /dashboard/admin/users/123)
    if (href !== "/dashboard/admin" && 
        href !== "/dashboard/petugas" && 
        href !== "/dashboard/peminjam" && 
        pathname.startsWith(href)) {
      return true;
    }
    return false;
  };

  const navItems = menuByRole[role];

  // Get role-specific branding
  const getRoleBranding = () => {
    switch(role) {
      case "ADMIN":
        return { title: "Admin Panel", subtitle: "Administrator", };
      case "PETUGAS":
        return { title: "Staff Panel", subtitle: "Equipment Management", };
      case "PEMINJAM":
        return { title: "User's Page", subtitle: "My Borrowings", };
      default:
        return { title: "Studio Tools", subtitle: "Dashboard", };
    }
  };

  const branding = getRoleBranding();

  return (
    <aside 
      className={`flex flex-col h-screen sticky top-0 transition-all shadow-2xl ${
        isCollapsed ? "w-20" : "w-72"
      }`}
      style={{ backgroundColor: `var(--color-navy)` }}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-50 p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: `var(--color-cyan)`, color: `var(--color-navy)` }}
      >
        <ChevronRight size={16} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Logo & Brand Section */}
      <div className={`p-6 border-b transition-all duration-300 ${isCollapsed ? "px-4" : ""}`} style={{ borderColor: `rgba(74,78,137,0.3)` }}>
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative shrink-0">
            <Image
              src="/StudioTools.png"
              alt="Studio Tools"
              width={isCollapsed ? 36 : 40}
              height={isCollapsed ? 36 : 40}
              className="relative rounded-xl"
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h2 className="text-lg font-bold truncate" style={{ color: `var(--color-cyan)` }}>
                {branding.title}
              </h2>
              <p className="text-xs truncate" style={{ color: `var(--color-warm)` }}>
                {branding.subtitle}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isRouteActive(item.href);
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group relative flex items-center transition-all duration-200 rounded-xl
                ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2.5"}
                ${active 
                  ? "shadow-lg" 
                  : "hover:bg-white/5"
                }
              `}
              style={active ? { 
                background: `linear-gradient(135deg, var(--color-urban), transparent)`,
                borderLeft: `3px solid var(--color-cyan)`
              } : {}}
              title={isCollapsed ? item.name : ""}
            >
              <Icon 
                size={isCollapsed ? 20 : 18} 
                className="shrink-0 transition-colors"
                style={{ color: active ? `var(--color-cyan)` : `rgba(255,255,255,0.6)` }}
              />
              {!isCollapsed && (
                <>
                  <span 
                    className="flex-1 text-sm font-medium transition-colors"
                    style={{ color: active ? `white` : `rgba(255,255,255,0.7)` }}
                  >
                    {item.name}
                  </span>
                  {active && (
                    <ChevronRight size={14} style={{ color: `var(--color-cyan)` }} />
                  )}
                </>
              )}
              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50" style={{ backgroundColor: `var(--color-urban)`, color: `white` }}>
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t mt-auto" style={{ borderColor: `rgba(74,78,137,0.3)` }}>
        {/* Logout Button */}
        <button
          className={`
            w-full flex items-center transition-all duration-200 rounded-xl
            ${isCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2.5"}
            hover:bg-white/5 group
          `}
          onClick={() => {
            // Handle logout
            window.location.href = "/auth/login";
          }}
        >
          <LogOut size={isCollapsed ? 20 : 18} style={{ color: `var(--color-neon)` }} />
          {!isCollapsed && (
            <span className="text-sm" style={{ color: `rgba(255,255,255,0.7)` }}>
              Logout
            </span>
          )}
          {/* Tooltip for collapsed mode */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50" style={{ backgroundColor: `var(--color-urban)`, color: `white` }}>
              Logout
            </div>
          )}
        </button>

        {/* Version Info - Only when expanded */}
        {!isCollapsed && (
          <p className="text-center text-xs mt-4" style={{ color: `rgba(255,255,255,0.3)` }}>
            Version 2.0.0
          </p>
        )}
      </div>
    </aside>
  );
}