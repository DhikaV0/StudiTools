import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardEntry() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (user.role === "PETUGAS") {
    redirect("/dashboard/petugas");
  }

  if (user.role === "PEMINJAM") {
    redirect("/dashboard/user");
  }

  return null;
}