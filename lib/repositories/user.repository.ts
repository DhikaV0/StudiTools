import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export class UserRepository {
  static async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static async create(data: {
    name: string;
    username: string;
    password: string;
    role: Role;
  }) {
    return prisma.user.create({
      data,
    });
  }

  static async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }
}