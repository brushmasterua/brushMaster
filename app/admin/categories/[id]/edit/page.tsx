"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Container } from "@/components/shared/container";
import { generateSlug } from "@/lib/slugify";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function EditCategory() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Category | null>(null);

  useEffect(() => {
    fetch(`/api/admin/categories/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setFetching(false);
      })
      .catch(console.error);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === "name") {
      const slug = generateSlug(value);
      setFormData(prev => prev ? { ...prev, slug } : prev);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push("/admin/categories");
      } else {
        alert("Помилка при оновленні категорії");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при оновленні категорії");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container className="py-8 max-w-2xl mx-auto">
        <div className="text-center text-gray-500">Завантаження...</div>
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container className="py-8 max-w-2xl mx-auto">
        <div className="text-center text-red-500">Категорію не знайдено</div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/categories">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Редагування категорії</h1>
          <p className="text-gray-500 text-sm">Змініть інформацію про категорію</p>
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
            Slug використовується в URL категорії
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