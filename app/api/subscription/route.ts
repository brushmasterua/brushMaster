// ⚠️ ВАЖЛИВО ДЛЯ VERCEL: вказуємо використовувати Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ← ДОДАТИ ЦЕЙ РЯДОК
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Будь ласка, введіть коректну email адресу" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"BrushMaster" <${process.env.EMAIL_USER}>`,
      to: "brushmaster.ua@gmail.com",
      subject: "Новий контакт з сайту",
      html: `
        <h2>Нове повідомлення з сайту BrushMaster</h2>
        <p><strong>Email клієнта:</strong> ${email}</p>
        <p><strong>Дата:</strong> ${new Date().toLocaleString("uk-UA")}</p>
        <p>Клієнт залишив свій email для зв'язку.</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Дякуємо! Ми зв'яжемося з вами" });
  } catch (error) {
    console.error("Помилка:", error);
    return NextResponse.json(
      { error: "Помилка відправки. Спробуйте пізніше" },
      { status: 500 }
    );
  }
}