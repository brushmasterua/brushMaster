import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationToCustomer, sendOrderNotificationToAdmin } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Валідація обов'язкових полів
    if (!body.firstName || !body.lastName || !body.phone || !body.city || !body.address) {
      return NextResponse.json(
        { error: "Будь ласка, заповніть всі обов'язкові поля" },
        { status: 400 }
      );
    }
    
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Кошик порожній" },
        { status: 400 }
      );
    }
    
    if (!body.totalPrice || body.totalPrice <= 0) {
      return NextResponse.json(
        { error: "Сума замовлення не може бути порожньою" },
        { status: 400 }
      );
    }
    
    // Генеруємо унікальний номер замовлення
    const orderNumber = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Отримуємо інформацію про товари з БД для актуальних цін
    const productIds = body.items.map((item: any) => item.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    
    const productMap = new Map(products.map(p => [p.id, p]));
    
    // Перевіряємо, чи всі товари існують
    for (const item of body.items) {
      if (!productMap.has(item.id)) {
        return NextResponse.json(
          { error: `Товар з ID ${item.id} не знайдено` },
          { status: 400 }
        );
      }
    }
    
    // Створюємо замовлення з усіма обов'язковими полями
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: `${body.firstName} ${body.lastName}`,
        customerPhone: body.phone,
        customerEmail: body.email || null,
        customerCity: body.city,
        customerAddress: body.address,
        deliveryMethod: body.deliveryMethod || "nova",
        paymentMethod: body.paymentMethod || "cash",
        comment: body.comment || null,
        total: body.totalPrice,
        status: "PENDING",
        items: {
          create: body.items.map((item: any) => {
            const product = productMap.get(item.id);
            return {
              productId: item.id,
              quantity: item.quantity,
              price: product?.price || item.price,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    // Підготовка даних для email
    const emailData = {
      orderNumber: order.orderNumber,
      customerName: `${body.firstName} ${body.lastName}`,
      customerEmail: body.email || '',
      customerPhone: body.phone,
      customerAddress: `${body.city}, ${body.address}`,
      items: body.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: body.totalPrice - (body.deliveryCost || 0),
      deliveryCost: body.deliveryCost || 0,
      finalTotal: body.totalPrice,
      deliveryMethod: body.deliveryMethod === "nova" ? "Нова Пошта" 
        : body.deliveryMethod === "ukrposhta" ? "Укрпошта" : "Самовивіз",
      paymentMethod: body.paymentMethod === "card" ? "Переказ на карту" : "Готівкою при отриманні",
      comment: body.comment,
    };
    
    // Відправляємо email клієнту (якщо вказав email)
    if (body.email) {
      try {
        await sendOrderConfirmationToCustomer(emailData);
        console.log(`📧 Email клієнту відправлено: ${body.email}`);
      } catch (emailError) {
        console.error("❌ Помилка відправки email клієнту:", emailError);
      }
    }
    
    // Відправляємо сповіщення адміністратору
    try {
      await sendOrderNotificationToAdmin(emailData);
      console.log("📧 Email адміністратору відправлено");
    } catch (emailError) {
      console.error("❌ Помилка відправки email адміністратору:", emailError);
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("❌ Помилка створення замовлення:", error);
    return NextResponse.json(
      { error: "Помилка створення замовлення. Спробуйте ще раз." },
      { status: 500 }
    );
  }
}