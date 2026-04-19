import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизовано" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");

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
    
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "Немає замовлень для експорту" },
        { status: 404 }
      );
    }

    // Лист 1: Замовлення
    const excelData = orders.map(order => ({
      "№": order.id,
      "Номер замовлення": order.orderNumber,
      "Дата": new Date(order.createdAt).toLocaleString("uk-UA"),
      "Клієнт": order.customerName,
      "Телефон": order.customerPhone,
      "Email": order.customerEmail || "-",
      "Місто": order.customerCity,
      "Адреса": order.customerAddress,
      "Спосіб доставки": order.deliveryMethod === "nova" ? "Нова Пошта" 
        : order.deliveryMethod === "ukrposhta" ? "Укрпошта" : "Кур'єр",
      "Оплата": order.paymentMethod === "card" ? "Карткою" : "Готівка при отриманні",
      "Сума": `${Number(order.total).toLocaleString()} ₴`,
      "Статус": order.status === "PENDING" ? "Нове"
        : order.status === "PAID" ? "Оплачено"
        : order.status === "SHIPPED" ? "Відправлено"
        : order.status === "DELIVERED" ? "Доставлено" : "Скасовано",
      "Коментар": order.comment || "-",
    }));

    // Лист 2: Товари в замовленнях
    const itemsData = orders.flatMap(order => 
      order.items.map(item => ({
        "Номер замовлення": order.orderNumber,
        "Товар": item.product.name,
        "Кількість": item.quantity,
        "Ціна": `${Number(item.price).toLocaleString()} ₴`,
        "Сума": `${(item.quantity * Number(item.price)).toLocaleString()} ₴`,
      }))
    );

    // Лист 3: Статистика
    const totalSum = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const avgOrder = orders.length > 0 ? totalSum / orders.length : 0;
    
    // Підрахунок товарів
    const productStats: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const name = item.product.name;
        productStats[name] = (productStats[name] || 0) + item.quantity;
      });
    });
    
    const topProducts = Object.entries(productStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => `${name} (${qty} шт.)`)
      .join(", ");

    // Підрахунок за статусами
    const statusStats: Record<string, number> = {};
    orders.forEach(order => {
      statusStats[order.status] = (statusStats[order.status] || 0) + 1;
    });

    const statsData = [
      { "Показник": "Всього замовлень", "Значення": orders.length },
      { "Показник": "Загальна сума", "Значення": `${totalSum.toLocaleString()} ₴` },
      { "Показник": "Середній чек", "Значення": `${Math.round(avgOrder).toLocaleString()} ₴` },
      { "Показник": "Найпопулярніший товар", "Значення": topProducts || "-" },
      { "Показник": "Нові замовлення", "Значення": statusStats["PENDING"] || 0 },
      { "Показник": "Оплачені", "Значення": statusStats["PAID"] || 0 },
      { "Показник": "Відправлені", "Значення": statusStats["SHIPPED"] || 0 },
      { "Показник": "Доставлені", "Значення": statusStats["DELIVERED"] || 0 },
      { "Показник": "Скасовані", "Значення": statusStats["CANCELLED"] || 0 },
    ];

    // Створення Excel файлу
    const wsOrders = XLSX.utils.json_to_sheet(excelData);
    const wsItems = XLSX.utils.json_to_sheet(itemsData);
    const wsStats = XLSX.utils.json_to_sheet(statsData);

    // Налаштування ширини колонок
    wsOrders["!cols"] = [
      { wch: 5 },   // №
      { wch: 25 },  // Номер замовлення
      { wch: 20 },  // Дата
      { wch: 20 },  // Клієнт
      { wch: 15 },  // Телефон
      { wch: 25 },  // Email
      { wch: 15 },  // Місто
      { wch: 30 },  // Адреса
      { wch: 15 },  // Спосіб доставки
      { wch: 20 },  // Оплата
      { wch: 12 },  // Сума
      { wch: 12 },  // Статус
      { wch: 30 },  // Коментар
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsOrders, "Замовлення");
    XLSX.utils.book_append_sheet(wb, wsItems, "Товари");
    XLSX.utils.book_append_sheet(wb, wsStats, "Статистика");

    // Генерація файлу
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    
    const fileName = `orders_${new Date().toISOString().split("T")[0]}.xlsx`;
    
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Помилка експорту:", error);
    return NextResponse.json(
      { error: "Помилка експорту замовлень" },
      { status: 500 }
    );
  }
}