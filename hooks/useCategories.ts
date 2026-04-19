// hooks/useCategories.ts
import { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return { categories, loading };
}