import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

// GET - отримання одного замовлення
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

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Замовлення не знайдено" },
        { status: 404 }
      );
    }

    const transformedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      customerCity: order.customerCity,
      customerAddress: order.customerAddress,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      comment: order.comment,
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.image,
        },
      })),
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error("Помилка отримання замовлення:", error);
    return NextResponse.json(
      { error: "Помилка отримання замовлення" },
      { status: 500 }
    );
  }
}

    // DELETE - видалення замовлення
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

    // Спочатку видаляємо всі товари в замовленні
    await prisma.orderItem.deleteMany({
      where: { orderId: parseInt(id) },
    });

    // Потім видаляємо саме замовлення
    await prisma.order.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Помилка видалення замовлення:", error);
    return NextResponse.json(
      { error: "Помилка видалення замовлення" },
      { status: 500 }
    );
  }
}

// PUT - оновлення статусу замовлення
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

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Помилка оновлення статусу:", error);
    return NextResponse.json(
      { error: "Помилка оновлення статусу" },
      { status: 500 }
    );
  }
}