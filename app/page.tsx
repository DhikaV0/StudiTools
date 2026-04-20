import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/auth/login");
    }

    try {
        const decoded: any = verifyToken(token);

        if (decoded.role === "ADMIN") {
            redirect("/dashboard/admin");
        }

        if (decoded.role === "PETUGAS") {
            redirect("/dashboard/petugas");
        }

        if (decoded.role === "PEMINJAM") {
            redirect("/dashboard/peminjam");
        }
    } catch {
        redirect("/auth/login");
    }

    redirect("/auth/login");
}
