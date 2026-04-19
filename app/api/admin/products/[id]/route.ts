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
    
    if (!id) {
      return NextResponse.json(
        { error: "ID товару не вказано" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Товар не знайдено" },
        { status: 404 }
      );
    }

    const transformedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      stock: product.stock,
      image: product.image,
      imagePublicId: product.imagePublicId,
      categoryId: product.categoryId,
      isNew: product.isNew,
      isHit: product.isHit,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error("Помилка отримання товару:", error);
    return NextResponse.json(
      { error: "Помилка отримання товару" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (product?.imagePublicId) {
      try {
        const { deleteImage } = await import("@/lib/cloudinary");
        await deleteImage(product.imagePublicId);
      } catch (error) {
        console.error("Помилка видалення фото:", error);
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