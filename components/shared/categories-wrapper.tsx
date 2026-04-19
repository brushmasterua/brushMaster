// components/shared/categories-wrapper.tsx
"use client";

import { Categories } from "./categories";
import { useRouter, useSearchParams } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";

interface Props {
  className?: string;
}

export function CategoriesWrapper({ className }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";
  const { categories, loading } = useCategories();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 mb-6 p-1 rounded-xl flex gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-11 w-20 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const cats = [
    { value: "all", label: "Всі" },
    ...categories.map(cat => ({
      value: cat.slug,
      label: cat.name,
    }))
  ];

  return (
    <Categories
      className={className}
      cats={cats}
      onCategoryChange={handleCategoryChange}
      defaultValue={currentCategory}
    />
  );
}