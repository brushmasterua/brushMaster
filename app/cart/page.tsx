"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Trash2, Minus, Plus, ShoppingBag, CreditCard, ChevronRight } from "lucide-react";
import { useCartStore, useTotalItems, useTotalPrice } from "@/store/cart";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const totalItems = useTotalItems();
  const totalPrice = useTotalPrice();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = totalPrice;
  const deliveryCost = subtotal > 1000 ? 0 : 50;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = subtotal + deliveryCost - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "brush10") {
      setPromoApplied(true);
    } else {
      alert("Невірний промокод");
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Кошик порожній</h1>
          <p className="text-gray-500 mb-6">Додайте товари до кошика, щоб оформити замовлення</p>
          <Link href="/">
            <Button className="bg-[#f97316] hover:bg-orange-600 cursor-pointer">
              Перейти до покупок
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-2">
      <h1 className="text-2xl text-center md:text-left md:text-3xl font-bold mb-8">Кошик з товарами</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
              <div className="col-span-6">Товар</div>
              <div className="col-span-2 text-center">Ціна</div>
              <div className="col-span-2 text-center">Кількість</div>
              <div className="col-span-1 text-center">Сума</div>
              <div className="col-span-1"></div>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item.id} className="p-4 md:p-6">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6">
                    <div className="flex gap-4 md:col-span-6">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-medium text-gray-900 hover:text-[#f97316] transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="mt-2 md:hidden">
                          <div className="text-sm text-gray-500">
                            Ціна: {item.price} ₴
                          </div>
                          <div className="text-sm font-medium text-[#f97316] mt-1">
                            Сума: {item.price * item.quantity} ₴
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex md:col-span-2 items-center justify-center">
                      <span className="text-gray-900">{item.price} ₴</span>
                    </div>

                    <div className="flex items-center justify-between md:justify-center md:col-span-2">
                      <span className="text-sm text-gray-500 md:hidden">Кількість:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#f97316] hover:text-[#f97316] transition-colors cursor-pointer"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#f97316] hover:text-[#f97316] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:flex md:col-span-1 items-center justify-center">
                      <span className="font-medium text-[#f97316]">
                        {item.price * item.quantity} ₴
                      </span>
                    </div>

                    <div className="flex items-center justify-end md:col-span-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        aria-label="Видалити товар"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

         <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
  <Link href="/" className="w-full sm:w-auto">
    <Button 
      variant="outline" 
      className="w-full sm:w-auto gap-2 cursor-pointer justify-center"
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      Продовжити покупки
    </Button>
  </Link>
  
  {items.length > 0 && (
    <Button 
      variant="outline" 
      className="w-full sm:w-auto gap-2 text-red-500 hover:text-red-600 border-red-300 hover:border-red-400 cursor-pointer justify-center"
      onClick={clearCart}
    >
      <Trash2 className="w-4 h-4" />
      Очистити кошик
    </Button>
  )}
</div>
        </div>

        <div className="lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Підсумок замовлення</h2>
            
            <div className="space-y-3 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Товари ({totalItems} шт.)</span>
                <span>{subtotal.toLocaleString()} ₴</span>
              </div>
              {/* <div className="flex justify-between text-gray-600">
                <span>Доставка</span>
                <span>{deliveryCost === 0 ? "Безкоштовно" : `${deliveryCost} ₴`}</span>
              </div> */}
              {/* {deliveryCost > 0 && (
                <div className="text-xs text-gray-400">
                  Безкоштовна доставка при замовленні від 1000 ₴
                </div>
              )}
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Знижка 10%</span>
                  <span>-{discount.toLocaleString()} ₴</span>
                </div>
              )} */}
            </div>

            <div className="flex justify-between py-4 text-lg font-bold">
              <span>До сплати</span>
              <span className="text-[#f97316]">{finalTotal.toLocaleString()} ₴</span>
            </div>

            <div className="mb-4">
              {/* <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Промокод"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                  disabled={promoApplied}
                />
                <Button
                  onClick={applyPromoCode}
                  disabled={promoApplied}
                  variant="outline"
                  className="border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white cursor-pointer"
                >
                  {promoApplied ? "Застосовано" : "Застосувати"}
                </Button>
              </div> */}
              {/* {!promoApplied && (
                <p className="text-xs text-gray-400 mt-2">
                  Промокод: BRUSH10 для знижки 10%
                </p>
              )} */}
            </div>

            <Link href="/checkout">
  <Button className="w-full bg-[#f97316] hover:bg-orange-600 gap-2 py-6 text-base cursor-pointer">
    <CreditCard className="w-5 h-5" />
    Оформити замовлення
  </Button>
</Link>

           <div className="mt-4 pt-4 border-t border-gray-100">
  <p className="text-xs text-gray-400 text-center">
    Реквізити для оплати надасть менеджер після оформлення замовлення
  </p>
</div>
          </div>
        </div>
      </div>
    </Container>
  );
}