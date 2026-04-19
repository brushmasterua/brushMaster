"use client";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { useCartStore, useTotalItems, useTotalPrice } from "@/store/cart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, ChevronRight, Truck, CreditCard, User, Phone, MapPin, MessageSquare, CheckSquare } from "lucide-react";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  comment: string;
  deliveryMethod: "nova" | "ukrposhta" | "courier";
  paymentMethod: "card" | "cash";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();
  
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    comment: "",
    deliveryMethod: "nova",
    paymentMethod: "card",
  });

//   const deliveryCost = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice ;

  // Якщо кошик порожній
  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Кошик порожній</h1>
          <p className="text-gray-500 mb-6">
            Додайте товари до кошика, щоб оформити замовлення
          </p>
          <Link href="/">
            <Button className="bg-[#f97316] hover:bg-orange-600 cursor-pointer">
              Перейти до покупок
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Перевірка чи користувач погодився з умовами
    if (!agreed) {
      alert("Будь ласка, підтвердіть згоду з умовами");
      return;
    }
    
    setStep("confirm");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    
    try {
      const orderData = {
        ...formData,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalPrice: finalTotal,
        deliveryCost,
      };
      
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      
      if (response.ok) {
        clearCart();
        router.push("/checkout/success");
      } else {
        alert("Помилка при оформленні замовлення. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при оформленні замовлення. Спробуйте ще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCart = () => {
    router.push("/cart");
  };

  // Крок 1: Форма
  if (step === "form") {
    return (
      <Container >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Форма */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-6">Оформлення замовлення</h1>
              
              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Контактні дані */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#f97316]" />
                    Контактні дані
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Ім'я *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Прізвище *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Телефон *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+380 XX XXX XXXX"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                      />
                    </div>
                  </div>
                </div>

                {/* Доставка */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#f97316]" />
                    Доставка
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Місто *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Адреса *</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          placeholder="Відділення Пошти №..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Спосіб доставки</label>
                      <select
                        name="deliveryMethod"
                        value={formData.deliveryMethod}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                      >
                        <option value="nova">Нова Пошта</option>
                        <option value="ukrposhta">Укрпошта</option>
                        <option value="courier">Самовивіз</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Оплата */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#f97316]" />
                    Оплата
                  </h2>
                  <div>
                    <label className="block text-sm font-medium mb-1">Спосіб оплати</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                    >
                      <option value="card">Карткою онлайн </option>
                      <option value="cash">Готівкою при отриманні</option>
                    </select>
                  </div>
                </div>

                {/* Коментар */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#f97316]" />
                    Коментар до замовлення
                  </h2>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Ваші побажання щодо замовлення..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] resize-none"
                  />
                </div>

                {/* Галочка згоди */}
                <div className="flex items-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {agreed ? (
                      <CheckSquare className="w-5 h-5 text-[#f97316] " />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-md" />
                    )}
                  </button>
                  <div className="text-sm text-gray-600">
                    Я погоджуюсь з{" "}
                    <Link href="/privacy" target="_blank" className="text-[#f97316] hover:underline">
                      Політикою конфіденційності
                    </Link>{" "}
                    та{" "}
                    <Link href="/terms" target="_blank" className="text-[#f97316] hover:underline">
                      Умовами використання
                    </Link>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToCart}
                    className="w-full sm:w-auto cursor-pointer order-2 sm:order-1"
                  >
                    Повернутися до кошика
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:flex-1 bg-[#f97316] hover:bg-orange-600 cursor-pointer order-1 sm:order-2"
                  >
                    Продовжити
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Підсумок замовлення */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Ваше замовлення</h2>
              
              <div className="space-y-3 max-h-80 overflow-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} шт. × {item.price} ₴
                      </p>
                    </div>
                    <p className="text-sm font-medium">{item.price * item.quantity} ₴</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Товари ({totalItems} шт.)</span>
                  <span>{totalPrice} ₴</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span>До сплати</span>
                  <span className="text-[#f97316]">{finalTotal} ₴</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Крок 2: Підтвердження
  return (
    <Container className=" max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Підтвердження замовлення</h1>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Контактні дані</h3>
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.phone}</p>
            {formData.email && <p>{formData.email}</p>}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Доставка</h3>
            <p>{formData.city}, {formData.address}</p>
            <p className="text-sm text-gray-500 mt-1">
              Спосіб доставки: {
                formData.deliveryMethod === "nova" ? "Нова Пошта" :
                formData.deliveryMethod === "ukrposhta" ? "Укрпошта" : "Самовивіз"
              }
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Оплата</h3>
            <p>{formData.paymentMethod === "card" ? "Переказ на карту" : "Готівкою при отриманні"}</p>
          </div>
          
          {formData.comment && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Коментар</h3>
              <p>{formData.comment}</p>
            </div>
          )}
          
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2">Товари</h3>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>{item.price * item.quantity} ₴</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 font-bold flex justify-between">
              <span>Разом:</span>
              <span className="text-[#f97316]">{finalTotal} ₴</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => setStep("form")}
            className="cursor-pointer w-full sm:w-auto"
          >
            Назад
          </Button>

          <Button
            onClick={handleConfirmOrder}
            disabled={loading}
            className="w-full sm:flex-1 bg-[#f97316] hover:bg-orange-600 cursor-pointer"
          >
            {loading ? "Обробка..." : "Підтвердити замовлення"}
          </Button>
        </div>
      </div>
    </Container>
  );
}