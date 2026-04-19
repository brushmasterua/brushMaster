"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);
  
  const isInCart = items.some(item => item.id === product.id);
  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      slug: product.slug,
      stock: product.stock,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!inStock || isInCart}
      className="w-full py-6 text-lg font-semibold rounded-xl bg-[#f97316] hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-all"
    >
      {isInCart ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Вже в кошику
        </>
      ) : isAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Додано!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          {inStock ? "Купити" : "Немає в наявності"}
        </>
      )}
    </Button>
  );
}