"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Container } from "@/components/shared/container";
import { generateSlug } from "@/lib/slugify";

export default function NewCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (name === "name") {
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push("/admin/categories");
      } else {
        const error = await response.json();
        alert(error.error || "Помилка при створенні категорії");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при створенні категорії");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Додати категорію</h1>
          <p className="text-gray-500 text-sm">Створення нової категорії товарів</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Назва категорії *</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Slug (посилання)</label>
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
          />
          <p className="text-xs text-gray-400 mt-1">
            Slug генерується автоматично з назви (тільки латиниця)
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Збереження..." : "Зберегти"}
          </button>
          
          <Link href="/admin/categories">
            <button type="button" className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
              Скасувати
            </button>
          </Link>
        </div>
      </form>
    </Container>
  );
}