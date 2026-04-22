"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Package,
  BookOpen,
  Clock,
  TrendingUp,
  Activity,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const statsConfig = stats
  ? [
      {
        title: "Total Users",
        value: stats.totalUsers,
        icon: Users,
        color: "cyan",
      },
      {
        title: "Total Equipment",
        value: stats.totalTools,
        icon: Package,
        color: "warm",
      },
      {
        title: "Total Borrowings",
        value: stats.totalBorrowings,
        icon: BookOpen,
        color: "neon",
      },
      {
        title: "Pending Approval",
        value: stats.pendingBorrowings,
        icon: Clock,
        color: "urban",
      },
    ]
  : [];

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
  
        if (json.success) {
          setStats(json.data.stats);
  
          const mapped = json.data.recentBorrowings.map((b: any) => ({
            id: b.id,
            user: b.user.name,
            action:
              b.status === "RETURNED"
                ? `Returned ${b.items.map((i: any) => i.tool.name).join(", ")}`
                : `Requested ${b.items.map((i: any) => i.tool.name).join(", ")}`,
            status: b.status.toLowerCase(),
            date: new Date(b.borrowDate).toLocaleDateString(),
            time: new Date(b.borrowDate).toLocaleTimeString(),
            avatar: b.user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2),
          }));
  
          setRecentActivities(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  
    fetchDashboard();
  }, []);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "approved":
        return { bg: "rgba(0,194,255,0.1)", text: "var(--color-cyan)", label: "Approved", icon: CheckCircle };
      case "pending":
        return { bg: "rgba(255,214,107,0.1)", text: "var(--color-warm)", label: "Pending", icon: AlertCircle };
      case "active":
        return { bg: "rgba(74,78,137,0.1)", text: "var(--color-urban)", label: "Active", icon: Activity };
      case "completed":
        return { bg: "rgba(255,101,132,0.1)", text: "var(--color-neon)", label: "Completed", icon: CheckCircle };
      default:
        return { bg: "rgba(255,255,255,0.1)", text: "white", label: status, icon: Activity };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: `var(--color-cyan)` }}>
            Admin Dashboard
          </h1>
          <p className="mt-1" style={{ color: `rgba(255,255,255,0.7)` }}>
            Overview of studio equipment borrowing system
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <select 
            className="px-4 py-2 rounded-lg bg-white/10 border backdrop-blur-sm text-white text-sm cursor-pointer"
            style={{ borderColor: `rgba(74,78,137,0.3)` }}
          >
            <option className="bg-navy">Today</option>
            <option className="bg-navy">This Week</option>
            <option className="bg-navy">This Month</option>
            <option className="bg-navy">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => {          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, rgba(27,27,47,0.9), rgba(74,78,137,0.2))`,
                backdropFilter: "blur(10px)",
                border: `1px solid rgba(74,78,137,0.3)`,
              }}
            >
              {/* Background Icon */}
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={80} />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2 rounded-xl"
                    style={{ background: `rgba(0,194,255,0.1)` }}
                  >
                    <Icon size={20} style={{ color: `var(--color-${stat.color})` }} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-sm" style={{ color: `rgba(255,255,255,0.6)` }}>{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Distribution */}
        <div className="rounded-2xl p-6" style={{
          background: `linear-gradient(135deg, rgba(27,27,47,0.9), rgba(74,78,137,0.2))`,
          backdropFilter: "blur(10px)",
          border: `1px solid rgba(74,78,137,0.3)`,
        }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Equipment Distribution</h2>
            <Link href="/dashboard/admin/equipment" className="text-sm transition-colors hover:opacity-80" style={{ color: `var(--color-cyan)` }}>
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { name: "Cameras", count: 45, percentage: 45, color: "cyan" },
              { name: "Audio Equipment", count: 32, percentage: 32, color: "neon" },
              { name: "Lighting", count: 28, percentage: 28, color: "warm" },
              { name: "Accessories", count: 51, percentage: 51, color: "urban" },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: `rgba(255,255,255,0.8)` }}>{item.name}</span>
                  <span style={{ color: `var(--color-${item.color})` }}>{item.count} items</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: `rgba(74,78,137,0.3)` }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, background: `var(--color-${item.color})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{
          background: `linear-gradient(135deg, rgba(27,27,47,0.9), rgba(74,78,137,0.2))`,
          backdropFilter: "blur(10px)",
          border: `1px solid rgba(74,78,137,0.3)`,
        }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Activity Summary</h2>
            <TrendingUp size={20} style={{ color: `var(--color-cyan)` }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl" style={{ background: `rgba(0,194,255,0.05)` }}>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-xs" style={{ color: `rgba(255,255,255,0.6)` }}>Total Transactions</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: `rgba(255,214,107,0.05)` }}>
              <p className="text-2xl font-bold text-white">89%</p>
              <p className="text-xs" style={{ color: `rgba(255,255,255,0.6)` }}>Return Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="rounded-2xl overflow-hidden" style={{
        background: `linear-gradient(135deg, rgba(27,27,47,0.9), rgba(74,78,137,0.2))`,
        backdropFilter: "blur(10px)",
        border: `1px solid rgba(74,78,137,0.3)`,
      }}>
        <div className="p-6 border-b" style={{ borderColor: `rgba(74,78,137,0.3)` }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Recent Activities</h2>
              <p className="text-sm mt-1" style={{ color: `rgba(255,255,255,0.6)` }}>
                Latest borrowing requests and updates
              </p>
            </div>
            <Link 
              href="/dashboard/admin/borrowings" 
              className="flex items-center gap-1 text-sm transition-colors hover:opacity-80"
              style={{ color: `var(--color-cyan)` }}
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ borderBottom: `1px solid rgba(74,78,137,0.3)` }}>
              <tr>
                <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: `rgba(255,255,255,0.5)` }}>USER</th>
                <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: `rgba(255,255,255,0.5)` }}>ACTION</th>
                <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: `rgba(255,255,255,0.5)` }}>STATUS</th>
                <th className="text-left py-4 px-6 text-xs font-medium" style={{ color: `rgba(255,255,255,0.5)` }}>DATE & TIME</th>
                <th className="text-right py-4 px-6 text-xs font-medium" style={{ color: `rgba(255,255,255,0.5)` }}></th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => {
                const statusConfig = getStatusConfig(activity.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr 
                    key={activity.id} 
                    className="transition-colors hover:bg-white/5"
                    style={{ borderBottom: `1px solid rgba(74,78,137,0.2)` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `rgba(0,194,255,0.2)`, color: `var(--color-cyan)` }}
                        >
                          {activity.avatar}
                        </div>
                        <span className="text-white text-sm">{activity.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm" style={{ color: `rgba(255,255,255,0.8)` }}>
                        {activity.action}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div 
                          className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          style={{ background: statusConfig.bg, color: statusConfig.text }}
                        >
                          <StatusIcon size={12} />
                          {statusConfig.label}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-white">{activity.date}</p>
                        <p className="text-xs" style={{ color: `rgba(255,255,255,0.5)` }}>{activity.time}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 