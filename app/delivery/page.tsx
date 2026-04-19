import { Container } from "@/components/shared/container";
import { Truck, CreditCard, Clock, MapPin, Package, Shield, Phone, Mail } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Доставка та оплата | BrushMaster",
  description: "Умови доставки та оплати інтернет-магазину BrushMaster. Безкоштовна доставка від 1000 грн. Оплата карткою або готівкою.",
};

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секція */}
      <div className="text-center py-4">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Доставка та оплата</h1>
          <p className="">Зручні способи отримання та оплати ваших замовлень</p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Переваги */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-[#f97316]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Швидка доставка</h3>
              <p className="text-gray-500 text-sm">Доставка по всій Україні за 1-3 дні</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-7 h-7 text-[#f97316]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Зручна оплата</h3>
              <p className="text-gray-500 text-sm">Оплата карткою або готівкою при отриманні</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-[#f97316]" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Безпечна упаковка</h3>
              <p className="text-gray-500 text-sm">Надійна упаковка для збереження товару</p>
            </div>
          </div>

          {/* Доставка */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#f97316]" />
              </div>
              <h2 className="text-2xl font-bold">Доставка</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#f97316]" />
                  Способи доставки
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-2" />
                    <div>
                      <span className="font-medium">Нова Пошта</span>
                      <p className="text-sm text-gray-500">Доставка у відділення або поштомат. Термін: 1-3 робочих дні.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-2" />
                    <div>
                      <span className="font-medium">Укрпошта</span>
                      <p className="text-sm text-gray-500">Доставка у відділення. Термін: 3-7 робочих днів.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-2" />
                    <div>
                     <span className="font-medium">Самовивіз</span>
<p className="text-sm text-gray-500">Самовивіз зі складу за попередньою домовленістю. Термін: узгоджується з менеджером.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f97316]" />
                  Вартість доставки
                </h3>
                <ul className="space-y-2 text-gray-600">
                  {/* <li>• Безкоштовна доставка — при замовленні від 1000 грн</li> */}
                  <li>• Нова Пошта — згідно з тарифами перевізника</li>
                  <li>• Укрпошта — згідно з тарифами перевізника</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Як отримати замовлення</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                  <li>Оформіть замовлення на сайті або за телефоном</li>
                  <li>Після підтвердження замовлення ми надішлемо його у відділення</li>
                  <li>Отримайте SMS-повідомлення про прибуття замовлення</li>
                  <li>Заберіть замовлення у відділенні, пред'явивши документ</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Оплата */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#f97316]" />
              </div>
              <h2 className="text-2xl font-bold">Оплата</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Способи оплати</h3>
                <ul className="space-y-3 text-gray-600">
                  {/* <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-2" />
                    <div>
                      <span className="font-medium">Оплата карткою онлайн</span>
                      <p className="text-sm text-gray-500">При оформленні замовлення через захищений сервіс LiqPay. Приймаємо Visa/Mastercard.</p>
                    </div>
                  </li> */}
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-2" />
                    <div>
                      <span className="font-medium">Оплата готівкою при отриманні</span>
                      <p className="text-sm text-gray-500">Оплачуєте замовлення у відділенні Нової Пошти після огляду товару.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full mt-2" />
                    <div>
                      <span className="font-medium">Переказ на картку</span>
                      <p className="text-sm text-gray-500">Передоплата на картку ПриватБанку. Реквізити надасть менеджер.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold mb-2">Безпека платежів</h3>
                <p className="text-sm text-gray-600">
                   Усі перекази на картку відбуваються через захищені канали ПриватБанку. 
    Ми не зберігаємо дані ваших банківських карток. Реквізити для оплати надає менеджер після оформлення замовлення.
                </p>
              </div>
            </div>
          </div>

          {/* Повернення товару */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#f97316]" />
              </div>
              <h2 className="text-2xl font-bold">Повернення товару</h2>
            </div>
            
            <div className="space-y-3 text-gray-600">
              <p>
                Відповідно до Закону України "Про захист прав споживачів", ви маєте право повернути товар протягом 14 днів 
                з моменту отримання, якщо він не підійшов за формою, габаритами, фасоном, кольором або з інших причин.
              </p>
              <p className="mt-3">
                <span className="font-medium">Умови повернення:</span>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Товар не був у використанні</li>
                <li>Збережено товарний вигляд та упаковку</li>
                <li>Наявні всі ярлики та пломби</li>
              </ul>
              <p className="mt-3">
                Для повернення зв'яжіться з нами за телефоном або email. Кошти повертаються протягом 3-7 робочих днів.
              </p>
            </div>
          </div>

          {/* Контакти */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-4">Залишилися питання?</h2>
            <p className="text-gray-600 mb-4">
              Якщо у вас виникли питання щодо доставки або оплати, зв'яжіться з нами:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+380974570352" className="flex items-center gap-2 text-gray-600 hover:text-[#f97316] transition">
                <Phone className="w-4 h-4" />
                +380 97 457 03 52
              </a>
              <a href="mailto:brushmaster.ua@gmail.com" className="flex items-center gap-2 text-gray-600 hover:text-[#f97316] transition">
                <Mail className="w-4 h-4" />
                brushmaster.ua@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}