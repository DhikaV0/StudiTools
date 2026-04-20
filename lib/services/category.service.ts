import { prisma } from "@/lib/prisma";

export class CategoryService {
  static async getAll() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(name: string) {
    return prisma.category.create({
      data: { name },
    });
  }

  static async update(id: string, name: string) {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}