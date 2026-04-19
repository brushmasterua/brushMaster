import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const { id } = await params;
    
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Категорію не знайдено" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Помилка отримання категорії:", error);
    return NextResponse.json(
      { error: "Помилка отримання категорії" },
      { status: 500 }
    );
  }
}