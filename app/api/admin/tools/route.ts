import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const tools = await prisma.tool.findMany({
    include: {
      category: true,
    },
  });

  return NextResponse.json(tools);
}

export async function POST(req: Request) {
  const { name, description, categoryId, stockTotal, condition } =
    await req.json();

  const tool = await prisma.tool.create({
    data: {
      name,
      description,
      categoryId,
      stockTotal,
      stockAvailable: stockTotal,
      condition,
    },
  });

  return NextResponse.json(tool);
}