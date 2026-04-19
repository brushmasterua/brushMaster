import { Container } from "@/components/shared/container";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Умови використання | BrushMaster",
  description: "Умови використання інтернет-магазину BrushMaster. Правила оформлення замовлень, доставка, оплата, повернення товару.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секція */}
      <div className=" py-4">
        <Container>
          <h1 className="text-3xl text-center md:text-4xl font-bold mb-4">Умови використання</h1>
          <p className="text-center">Останнє оновлення: 18 квітня 2024 року</p>
        </Container>
      </div>

      <Container className="py-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Ласкаво просимо до BrushMaster. Використовуючи наш сайт, ви погоджуєтесь з наступними умовами. 
              Будь ласка, уважно ознайомтеся з ними перед здійсненням покупки.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Загальні положення</h2>
            <p className="text-gray-600 mb-4">
              1.1. Інтернет-магазин BrushMaster (надалі — "Магазин") пропонує товари для фарбування через веб-сайт.<br />
              1.2. Замовлення товару означає повне та беззастережне прийняття цих Умов.<br />
              1.3. Магазин залишає за собою право змінювати ці Умови без попередження.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Оформлення замовлення</h2>
            <p className="text-gray-600 mb-4">
              2.1. Замовлення може бути оформлене через сайт або за телефоном.<br />
              2.2. Після оформлення замовлення ви отримуєте підтвердження на email.<br />
              2.3. Магазин залишає за собою право скасувати замовлення у разі відсутності товару або технічної помилки.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Ціни та оплата</h2>
            <p className="text-gray-600 mb-4">
              3.1. Ціни на товари вказані в гривнях (UAH) з урахуванням ПДВ.<br />
              3.2. Магазин залишає за собою право змінювати ціни без попередження.<br />
              3.3. Оплата здійснюється через: карткою онлайн (LiqPay), готівкою при отриманні, на картку ПриватБанку.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Доставка</h2>
            <p className="text-gray-600 mb-4">
              4.1. Доставка здійснюється по всій території України.<br />
              4.2. Вартість доставки: безкоштовно при замовленні від 1000 грн, інакше 50 грн.<br />
              4.3. Термін доставки: 1-3 робочих дні (Нова Пошта), 3-7 робочих днів (Укрпошта).<br />
              4.4. Після відправлення замовлення ви отримуєте номер ТТН.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Повернення та обмін товару</h2>
            <p className="text-gray-600 mb-4">
              5.1. Відповідно до Закону України "Про захист прав споживачів", ви маєте право повернути товар протягом 14 днів.<br />
              5.2. Товар має бути невикористаним, з усіма ярликами та в оригінальній упаковці.<br />
              5.3. Для повернення зв'яжіться з нами за телефоном або email.<br />
              5.4. Кошти повертаються на картку протягом 3-7 робочих днів.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Гарантія</h2>
            <p className="text-gray-600 mb-4">
              6.1. На всі товари надається гарантія 14 днів.<br />
              6.2. Гарантійний ремонт або заміна здійснюється у разі виробничого браку.<br />
              6.3. Гарантія не поширюється на механічні пошкодження, спричинені користувачем.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Відповідальність</h2>
            <p className="text-gray-600 mb-4">
              7.1. Магазин не несе відповідальності за затримки доставки, спричинені службою доставки.<br />
              7.2. Магазин не несе відповідальності за неправильне використання товару.<br />
              7.3. Вся інформація на сайті є довідковою та не є публічною офертою.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Контакти</h2>
            <p className="text-gray-600 mb-4">
              З усіх питань звертайтеся до нас:
            </p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#f97316]" />
                <a href="mailto:brushmaster.ua@gmail.com" className="text-gray-600 hover:text-[#f97316]">
                  brushmaster.ua@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#f97316]" />
                <a href="tel:+380974570352" className="text-gray-600 hover:text-[#f97316]">
                  +380 97 457 03 52
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>© 2024 BrushMaster. Всі права захищено.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}