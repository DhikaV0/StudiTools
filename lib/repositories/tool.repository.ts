import { prisma } from "@/lib/prisma";

export class ToolRepository {
  static async findAll(skip: number, take: number) {
    return prisma.tool.findMany({
      skip,
      take,
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async count() {
    return prisma.tool.count();
  }

  static async findById(id: string) {
    return prisma.tool.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.tool.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.tool.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.tool.delete({
      where: { id },
    });
  }
}