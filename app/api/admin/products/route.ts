import { prisma } from "@/lib/prisma";
import { deleteImage } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// GET - отримання списку товарів
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId");

    const where: any = {};
    
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }
    
    if (categoryId && categoryId !== "all") {
      where.categoryId = parseInt(categoryId);
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Помилка отримання товарів:", error);
    return NextResponse.json(
      { error: "Помилка отримання товарів" },
      { status: 500 }
    );
  }
}

// POST - створення товару
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const body = await request.json();
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/ /g, "-"),
        description: body.description,
        price: parseFloat(body.price),
        oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
        stock: parseInt(body.stock),
        image: body.image,
        imagePublicId: body.imagePublicId, // Зберігаємо publicId для видалення
        categoryId: parseInt(body.categoryId),
        isNew: body.isNew || false,
        isHit: body.isHit || false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Помилка створення товару:", error);
    return NextResponse.json(
      { error: "Помилка створення товару" },
      { status: 500 }
    );
  }
}

// PUT - оновлення товару
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const body = await request.json();
    
    // Якщо зображення змінилося, видаляємо старе
    if (body.oldImagePublicId && body.oldImagePublicId !== body.imagePublicId) {
      try {
        await deleteImage(body.oldImagePublicId);
      } catch (error) {
        console.error("Помилка видалення старого фото:", error);
      }
    }
    
    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: parseFloat(body.price),
        oldPrice: body.oldPrice ? parseFloat(body.oldPrice) : null,
        stock: parseInt(body.stock),
        image: body.image,
        imagePublicId: body.imagePublicId,
        categoryId: parseInt(body.categoryId),
        isNew: body.isNew,
        isHit: body.isHit,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Помилка оновлення товару:", error);
    return NextResponse.json(
      { error: "Помилка оновлення товару" },
      { status: 500 }
    );
  }
}

// DELETE - видалення товару
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
        { error: "ID товару не вказано" },
        { status: 400 }
      );
    }

    // Отримуємо товар для видалення фото
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (product?.imagePublicId) {
      try {
        await deleteImage(product.imagePublicId);
      } catch (error) {
        console.error("Помилка видалення фото з Cloudinary:", error);
      }
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Помилка видалення товару:", error);
    return NextResponse.json(
      { error: "Помилка видалення товару" },
      { status: 500 }
    );
  }
}