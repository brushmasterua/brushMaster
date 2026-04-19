export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import nodemailer from 'nodemailer';

// Налаштування транспортера
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === '465', // true для 465, false для 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ← ДОДАТИ (для вирішення проблеми з сертифікатом)
  },
});

// Шаблон листа для клієнта
export const sendOrderConfirmationToCustomer = async (order: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalPrice: number;
  deliveryCost: number;
  finalTotal: number;
  deliveryMethod: string;
  paymentMethod: string;
}) => {
  // Перевірка наявності email
  if (!order.customerEmail) {
    console.log("Email не вказано, пропускаємо відправку");
    return;
  }

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price} ₴</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price * item.quantity} ₴</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Підтвердження замовлення</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f97316; color: white; padding: 10px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; padding-top: 10px; border-top: 2px solid #f97316; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Дякуємо за замовлення!</h1>
          <p>Номер замовлення: ${order.orderNumber}</p>
        </div>
        <div class="content">
          <div class="order-info">
            <h3>Деталі замовлення:</h3>
            <p><strong>Ім'я:</strong> ${order.customerName}</p>
            <p><strong>Телефон:</strong> ${order.customerPhone}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Адреса:</strong> ${order.customerAddress}</p>
            <p><strong>Доставка:</strong> ${order.deliveryMethod}</p>
            <p><strong>Оплата:</strong> ${order.paymentMethod}</p>
          </div>
          
          <h3>Склад замовлення:</h3>
          <table>
            <thead>
              <tr>
                <th>Товар</th>
                <th>Кількість</th>
                <th>Ціна</th>
                <th>Сума</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">
            <p>Вартість товарів: ${order.totalPrice} ₴</p>
            <p>Доставка: ${order.deliveryCost === 0 ? 'Безкоштовно' : order.deliveryCost + ' ₴'}</p>
            <p style="font-size: 20px; color: #f97316;">Всього до сплати: ${order.finalTotal} ₴</p>
          </div>
          
          <p style="margin-top: 20px;">
            Наш менеджер зв'яжеться з вами найближчим часом для підтвердження замовлення.
          </p>
        </div>
        <div class="footer">
          <p>© BrushMaster - магазин професійних інструментів для фарбування</p>
          <p>Цей лист створено автоматично, будь ласка, не відповідайте на нього.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"BrushMaster" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: `Підтвердження замовлення №${order.orderNumber}`,
      html,
    });
    console.log(`✅ Email клієнту відправлено: ${order.customerEmail}`);
  } catch (error) {
    console.error("❌ Помилка відправки email клієнту:", error);
    throw error;
  }
};

// Шаблон листа для адміністратора
export const sendOrderNotificationToAdmin = async (order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  totalPrice: number;
  finalTotal: number;
  deliveryMethod: string;
  paymentMethod: string;
  comment?: string;
}) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price * item.quantity} ₴</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Нове замовлення</title>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 15px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f97316; color: white; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Нове замовлення!</h1>
          <h2>№${order.orderNumber}</h2>
        </div>
        <div class="content">
          <h3>Інформація про клієнта:</h3>
          <p><strong>Ім'я:</strong> ${order.customerName}</p>
          <p><strong>Телефон:</strong> ${order.customerPhone}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Адреса:</strong> ${order.customerAddress}</p>
          <p><strong>Доставка:</strong> ${order.deliveryMethod}</p>
          <p><strong>Оплата:</strong> ${order.paymentMethod}</p>
          ${order.comment ? `<p><strong>Коментар:</strong> ${order.comment}</p>` : ''}
          
          <h3>Склад замовлення:</h3>
          <table>
            <thead>
              <tr><th>Товар</th><th>Кількість</th><th>Сума</th></tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <h3 style="color: #f97316;">Загальна сума: ${order.finalTotal} ₴</h3>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"BrushMaster" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Нове замовлення №${order.orderNumber}`,
      html,
    });
    console.log(`✅ Email адміністратору відправлено`);
  } catch (error) {
    console.error("❌ Помилка відправки email адміністратору:", error);
    throw error;
  }
};