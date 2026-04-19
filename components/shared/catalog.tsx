// components/shared/catalog.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { GoodCard } from "./good";
import { CatalogSkeleton } from "./catalog-skeleton";

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

  // Показуємо повідомлення під час завантаження
  if (loading) {
    return (
    <CatalogSkeleton/>
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