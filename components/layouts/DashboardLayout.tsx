import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import Sidebar from "./Sidebar";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  const { payload } = await jwtVerify(token, secret);
  const role = payload.role as "ADMIN" | "PETUGAS" | "PEMINJAM";

  return (
    <div className="flex p-8 gap-8">
      <Sidebar role={role} />
      <main className="flex-1">{children}</main>
    </div>
  );
}