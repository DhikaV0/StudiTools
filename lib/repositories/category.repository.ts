import { prisma } from "@/lib/prisma";

export class CategoryRepository {
  static async findAll(skip: number, take: number) {
    return prisma.category.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  static async count() {
    return prisma.category.count();
  }

  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  static async findByName(name: string) {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  static async create(data: { name: string }) {
    return prisma.category.create({ data });
  }

  static async update(id: string, data: { name: string }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}