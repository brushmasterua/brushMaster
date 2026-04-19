import { Container } from "@/components/shared/container";
import { Calendar, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Політика конфіденційності | BrushMaster",
  description: "Політика конфіденційності інтернет-магазину BrushMaster. Захист персональних даних користувачів.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секція */}
      <div className=" py-4">
        <Container>
          <h1 className="text-3xl text-center md:text-4xl font-bold mb-4">Політика конфіденційності</h1>
          <p className="text-center">Останнє оновлення: 18 квітня 2024 року</p>
        </Container>
      </div>

      <Container className="py-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6">
              Ласкаво просимо до BrushMaster. Ми цінуємо вашу довіру та поважаємо вашу приватність. 
              Ця Політика конфіденційності пояснює, які дані ми збираємо, як їх використовуємо та захищаємо.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">1. Збір персональних даних</h2>
            <p className="text-gray-600 mb-4">
              Ми збираємо наступну інформацію, коли ви користуєтеся нашим сайтом:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Ім'я та прізвище</li>
              <li>Контактна інформація (email, телефон)</li>
              <li>Адреса доставки</li>
              <li>Історія замовлень</li>
              <li>IP-адреса та дані про пристрій</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Використання даних</h2>
            <p className="text-gray-600 mb-4">
              Ми використовуємо зібрану інформацію для:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Обробки та доставки ваших замовлень</li>
              <li>Зв'язку з вами щодо замовлень</li>
              <li>Покращення роботи нашого сайту</li>
              <li>Надсилання інформаційних розсилок (за вашою згодою)</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Захист даних</h2>
            <p className="text-gray-600 mb-4">
              Ми вживаємо належних заходів безпеки для захисту ваших персональних даних від несанкціонованого доступу, 
              зміни, розголошення або знищення. Всі транзакції через сайт захищені SSL-шифруванням.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Файли cookie</h2>
            <p className="text-gray-600 mb-4">
              Наш сайт використовує файли cookie для покращення роботи та аналітики. Ви можете налаштувати 
              браузер для блокування cookie, але це може вплинути на функціональність сайту.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Передача даних третім особам</h2>
            <p className="text-gray-600 mb-4">
              Ми не продаємо, не обмінюємо та не передаємо ваші персональні дані третім особам, за винятком випадків, 
              передбачених законодавством або необхідних для виконання замовлення (наприклад, службам доставки).
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Ваші права</h2>
            <p className="text-gray-600 mb-4">
              Ви маєте право:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Отримувати інформацію про ваші дані, що зберігаються</li>
              <li>Вимагати виправлення неточної інформації</li>
              <li>Вимагати видалення ваших даних</li>
              <li>Відкликати згоду на обробку даних</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Контакти</h2>
            <p className="text-gray-600 mb-4">
              Якщо у вас є питання щодо цієї Політики конфіденційності, будь ласка, зв'яжіться з нами:
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