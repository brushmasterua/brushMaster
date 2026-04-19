"use client";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <Container className="py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Замовлення прийнято!</h1>
        <p className="text-gray-500 mb-6">
          Дякуємо за покупку! Наш менеджер зв'яжеться з вами найближчим часом.
        </p>
        
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-[#f97316] hover:bg-orange-600 cursor-pointer">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Продовжити покупки
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}