// components/shared/catalog.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoodCard } from "./good";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  slug: string;
  stock: number;
  isNew: boolean;
  isHit: boolean;
  categoryId: number;
}

export default function Catalog() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categorySlug && categorySlug !== "all") {
          params.set("category", categorySlug);
        }
        
        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Помилка завантаження товарів:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden">
            <Skeleton className="aspect-square rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Товари не знайдені</p>
      </div>
    );
  }

  return (
    <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <GoodCard key={product.id} {...product} />
      ))}
    </div>
  );
}