import {
  LayoutDashboard,
  Users,
  Package,
  Folder,
  ClipboardList,
  FileText,
  BookOpen,
  RotateCcw,
} from "lucide-react";

export type Role = "ADMIN" | "PETUGAS" | "PEMINJAM";

export const sidebarConfig: Record<Role, any[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Equipment", href: "/dashboard/admin/equipment", icon: Package },
    { label: "Categories", href: "/dashboard/admin/categories", icon: Folder },
    { label: "Borrowings", href: "/dashboard/admin/borrowings", icon: ClipboardList },
    { label: "Reports", href: "/dashboard/admin/reports", icon: FileText },
  ],

  PETUGAS: [
    { label: "Dashboard", href: "/dashboard/petugas", icon: LayoutDashboard },
    { label: "Approve Borrowings", href: "/dashboard/petugas/borrowings", icon: ClipboardList },
    { label: "Return Monitoring", href: "/dashboard/petugas/returns", icon: RotateCcw },
    { label: "Reports", href: "/dashboard/petugas/reports", icon: FileText },
  ],

  PEMINJAM: [
    { label: "Dashboard", href: "/dashboard/peminjam", icon: LayoutDashboard },
    { label: "Browse Equipment", href: "/dashboard/peminjam/equipment", icon: Package },
    { label: "My Borrowings", href: "/dashboard/peminjam/borrowings", icon: BookOpen },
    { label: "Return Tool", href: "/dashboard/peminjam/returns", icon: RotateCcw },
  ],
};