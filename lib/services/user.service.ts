import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export class UserService {
  static async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateRole(userId: string, role: Role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }
}