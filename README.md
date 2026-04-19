# 🖌️ BrushMaster - Інтернет-магазин професійних пензлів та інструментів для фарбування

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-00E5FF?logo=postgresql)](https://neon.tech/)

## 📖 Про проєкт

BrushMaster — це сучасний інтернет-магазин для продажу професійних пензлів, валиків та інструментів для фарбування. Проєкт побудований з використанням сучасних технологій та забезпечує повний цикл покупки: від перегляду товарів до оформлення замовлення.

### 🎯 Основні можливості

#### Для покупців:
- 🛍️ Перегляд каталогу товарів з фільтрацією за категоріями
- 🔍 Пошук товарів
- 🛒 Кошик з можливістю зміни кількості товарів
- 📦 Оформлення замовлення з формою контактних даних
- 📧 Email-підтвердження замовлення
- 📱 Повністю адаптивний дизайн

#### Для адміністратора:
- 🔐 Захищена адмін-панель (NextAuth)
- 📊 Дашборд зі статистикою
- 🖼️ Управління товарами (CRUD)
- 🏷️ Управління категоріями
- 📋 Управління замовленнями (перегляд, зміна статусу, видалення)
- 📤 Експорт замовлень в Excel
- 🖼️ Завантаження зображень через Cloudinary

## 🛠️ Технології

### Frontend
- **Next.js 15** — React фреймворк
- **TypeScript** — типізація
- **Tailwind CSS** — стилізація
- **shadcn/ui** — компоненти інтерфейсу
- **Zustand** — керування станом (кошик)

### Backend
- **Prisma** — ORM
- **Neon** — PostgreSQL база даних (serverless)
- **NextAuth.js** — автентифікація
- **Nodemailer / Resend** — відправка email

### Інтеграції
- **Cloudinary** — зберігання зображень
- **LiqPay** — платіжна система (опціонально)

## 📁 Структура проєкту
brushmaster/
├── app/
│ ├── admin/ # Адмін-панель
│ │ ├── dashboard/ # Головна сторінка
│ │ ├── products/ # Управління товарами
│ │ ├── orders/ # Управління замовленнями
│ │ └── categories/ # Управління категоріями
│ ├── api/ # API маршрути
│ ├── cart/ # Сторінка кошика
│ ├── checkout/ # Оформлення замовлення
│ ├── contact/ # Сторінка контактів
│ ├── delivery/ # Доставка та оплата
│ ├── privacy/ # Політика конфіденційності
│ ├── terms/ # Умови використання
│ └── product/[slug]/ # Сторінка товару
├── components/ # React компоненти
├── lib/ # Утиліти та конфігурації
├── prisma/ # Схема та міграції БД
├── public/ # Статичні файли
└── store/ # Zustand store (кошик)

## 🚀 Встановлення та запуск

### Передумови

- Node.js 18+
- PostgreSQL (або обліковий запис Neon)
- Обліковий запис Cloudinary
- Gmail або інший SMTP сервер

### Крок 1: Клонування репозиторію

```bash
git clone https://github.com/YOUR_USERNAME/brushmaster.git
cd brushmaster