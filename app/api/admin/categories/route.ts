import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// GET - отримання списку категорій
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        products: {
          select: { id: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // Трансформуємо дані
    const transformedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productsCount: cat.products.length,
      createdAt: cat.createdAt,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Помилка отримання категорій:", error);
    return NextResponse.json(
      { error: "Помилка отримання категорій" },
      { status: 500 }
    );
  }
}

// POST - створення категорії
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const body = await request.json();
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/ /g, "-"),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Помилка створення категорії:", error);
    return NextResponse.json(
      { error: "Помилка створення категорії" },
      { status: 500 }
    );
  }
}

// PUT - оновлення категорії
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const body = await request.json();
    
    const category = await prisma.category.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Помилка оновлення категорії:", error);
    return NextResponse.json(
      { error: "Помилка оновлення категорії" },
      { status: 500 }
    );
  }
}

// DELETE - видалення категорії
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID категорії не вказано" },
        { status: 400 }
      );
    }

    // Перевіряємо, чи є товари в категорії
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { products: { select: { id: true } } },
    });

    if (category && category.products.length > 0) {
      return NextResponse.json(
        { error: "Неможливо видалити категорію, в якій є товари" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Помилка видалення категорії:", error);
    return NextResponse.json(
      { error: "Помилка видалення категорії" },
      { status: 500 }
    );
  }
}