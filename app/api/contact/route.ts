// ⚠️ ВАЖЛИВО ДЛЯ VERCEL: вказуємо використовувати Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Налаштування транспортера
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT === "465", // true для порту 465, false для 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Вирішує проблему з сертифікатом
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Валідація
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Будь ласка, заповніть всі обов'язкові поля" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Будь ласка, введіть коректну email адресу" },
        { status: 400 }
      );
    }

    // Лист адміністратору
    await transporter.sendMail({
      from: `"BrushMaster" <${process.env.EMAIL_USER}>`,
      to: "brushmaster.ua@gmail.com",
      subject: `Нове повідомлення від ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Нове повідомлення з сайту BrushMaster</h2>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 10px; margin: 20px 0;">
            <p><strong>👤 Ім'я:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>📞 Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
            <p><strong>📅 Дата:</strong> ${new Date().toLocaleString("uk-UA")}</p>
          </div>
          
          <div style="background: #fff; padding: 15px; border: 1px solid #eee; border-radius: 10px;">
            <h3 style="margin-top: 0;">💬 Повідомлення:</h3>
            <p style="color: #666;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          
          <hr style="margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            Ви отримали цей лист через форму зворотного зв'язку на сайті BrushMaster.
          </p>
        </div>
      `,
    });

    // Підтвердження клієнту (опціонально)
    await transporter.sendMail({
      from: `"BrushMaster" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Ми отримали ваше повідомлення",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Дякуємо, ${name}!</h2>
          <p>Ми отримали ваше повідомлення і відповімо найближчим часом.</p>
          <p>Ось копія вашого повідомлення:</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 10px;">
            <p style="color: #666;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <hr style="margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            З повагою,<br>Команда BrushMaster
          </p>
        </div>
      `,
    });

    return NextResponse.json({ 
      success: true, 
      message: "Дякуємо! Ваше повідомлення відправлено" 
    });
  } catch (error) {
    console.error("Помилка:", error);
    return NextResponse.json(
      { error: "Помилка відправки. Спробуйте пізніше" },
      { status: 500 }
    );
  }
}