// components/shared/good-card.tsx
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface GoodCardProps {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  slug: string;
  stock: number;
  isNew?: boolean;
  isHit?: boolean;
  className?: string;
}

export const GoodCard: React.FC<GoodCardProps> = ({
  id,
  name,
  price,
  oldPrice,
  image,
  slug,
  stock,
  isNew = false,
  isHit = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, items } = useCartStore();
  
  // Перевіряємо, чи товар вже в кошику
  const cartItem = items.find(item => item.id === id);
  const isInCart = !!cartItem;

  const discountPercent = oldPrice 
    ? Math.round(((oldPrice - price) / oldPrice) * 100) 
    : 0;

  const inStock = stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    
    addItem({
      id,
      name,
      price,
      quantity: 1,
      image,
      slug,
      stock,
    });
  };

  return (
    <div
      className={cn(
        "group relative border-2 border-gray-200 bg-white rounded-2xl overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Бейджі */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-md">
            NEW
          </span>
        )}
        {isHit && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded-md">
            ХІТ
          </span>
        )}
        {discountPercent > 0 && (
          <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-md">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Зображення */}
      <Link href={`/product/${slug}`} className="block overflow-hidden bg-gray-100">
        <div className="relative aspect-square">
          <Image
            src={image}
            alt={name}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              isHovered && "scale-110"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Інформація */}
      <div className="p-4">
        {/* Назва */}
        <Link href={`/product/${slug}`}>
          <h3 className="mb-2 text-base font-medium text-gray-800 line-clamp-2 hover:text-orange-500 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Ціна */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-orange-500">
            {price.toLocaleString()} ₴
          </span>
          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              {oldPrice.toLocaleString()} ₴
            </span>
          )}
        </div>

        {/* Статус наявності */}
        <div className="mb-3">
          {inStock ? (
            <span className="text-xs text-green-600">Є в наявності</span>
          ) : (
            <span className="text-xs text-red-500">Немає в наявності</span>
          )}
        </div>

        {/* Кнопка додати в кошик */}
        <Button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={cn(
            "w-full rounded-xl transition-all cursor-pointer",
            isInCart
              ? "bg-green-600 hover:bg-green-700"
              : "bg-orange-500 hover:bg-orange-600"
          )}
        >
          {isInCart ? "В кошику ✓" : "Купити"}
        </Button>
      </div>
    </div>
  );
};