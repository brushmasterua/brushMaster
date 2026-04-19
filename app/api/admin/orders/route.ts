import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// GET - отримання списку замовлень
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    
    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const transformedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt,
      itemsCount: order.items.length,
    }));



    return NextResponse.json({
      orders: transformedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Помилка отримання замовлень:", error);
    return NextResponse.json(
      { error: "Помилка отримання замовлень" },
      { status: 500 }
    );
  }
}