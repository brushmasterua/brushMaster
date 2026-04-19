// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");

    // Будуємо умови фільтрації
    const where: any = {};
    
    if (categorySlug && categorySlug !== "all") {
      where.category = {
        slug: categorySlug,
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Трансформуємо дані для клієнта (Decimal → number)
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      image: product.image,
      slug: product.slug,
      stock: product.stock,
      isNew: product.isNew,
      isHit: product.isHit,
      categoryId: product.categoryId,
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error("Помилка отримання товарів:", error);
    return NextResponse.json(
      { error: "Помилка отримання товарів" },
      { status: 500 }
    );
  }
}