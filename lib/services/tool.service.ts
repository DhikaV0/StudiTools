import { prisma } from "@/lib/prisma";

export class ToolService {
  static async getAll() {
    return prisma.tool.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(payload: any) {
    return prisma.tool.create({
      data: payload,
    });
  }

  static async update(id: string, payload: any) {
    return prisma.tool.update({
      where: { id },
      data: payload,
    });
  }

  static async delete(id: string) {
    return prisma.tool.delete({
      where: { id },
    });
  }
}