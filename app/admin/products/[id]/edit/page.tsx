"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ImageUpload } from "@/components/admin/image-upload";
import { generateSlug } from "@/lib/slugify";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  stock: number;
  image: string;
  imagePublicId: string | null;
  categoryId: number;
  isNew: boolean;
  isHit: boolean;
  createdAt: string;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Product | null>(null);

  // Завантаження даних
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(res => res.json()),
      fetch(`/api/admin/products/${id}`).then(res => res.json()),
    ]).then(([cats, product]) => {
      setCategories(cats);
      setFormData(product);
      setFetching(false);
    }).catch(console.error);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
    
    // Автоматична генерація slug при зміні назви
    if (name === "name") {
      const slug = generateSlug(value);
      if (slug) {
        setTimeout(() => {
          setFormData(prev => prev ? { ...prev, slug } : prev);
        }, 0);
      }
    }
  };

  const handleImageUpload = (url: string, publicId: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      image: url,
      imagePublicId: publicId,
    });
  };

  const handleImageRemove = () => {
    if (!formData) return;
    setFormData({
      ...formData,
      image: "",
      imagePublicId: null,
    });
  };

  const handleGenerateSlug = () => {
    if (!formData || !formData.name) return;
    const slug = generateSlug(formData.name);
    if (slug) {
      setFormData({ ...formData, slug });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          oldImagePublicId: formData.imagePublicId,
        }),
      });
      
      if (response.ok) {
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "Помилка при оновленні товару");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при оновленні товару");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Container className="py-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
          <p className="text-gray-500 mt-4">Завантаження даних...</p>
        </div>
      </Container>
    );
  }

  if (!formData) {
    return (
      <Container className="py-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <p className="text-red-500">Товар не знайдено</p>
          <Link href="/admin/products">
            <button className="mt-4 px-4 py-2 bg-[#f97316] text-white rounded-xl cursor-pointer">
              Повернутися до списку
            </button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Редагування товару</h1>
          <p className="text-gray-500 text-sm">Змініть інформацію про товар</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Назва *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleGenerateSlug}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Slug (посилання)</label>
            <div className="flex gap-2">
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="px-3 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
              >
                Ген
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Slug генерується автоматично з назви (тільки латиниця)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Опис</label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Ціна *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Стара ціна (знижка)</label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice || ""}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-1">Кількість на складі</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.stock > 0 ? "✅ В наявності" : "❌ Товар відсутній"}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Категорія *</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <ImageUpload
            onUpload={handleImageUpload}
            onRemove={handleImageRemove}
            currentImage={formData.image}
          />
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="w-4 h-4 accent-[#f97316] cursor-pointer"
            />
            <span className="text-sm">🆕 Новинка (відображається бейдж NEW)</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isHit"
              checked={formData.isHit}
              onChange={handleChange}
              className="w-4 h-4 accent-[#f97316] cursor-pointer"
            />
            <span className="text-sm">🔥 Хіт продажів (відображається бейдж ХІТ)</span>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-400">
            <span>🆔 ID товару: {formData.id}</span>
            <span>📅 Створено: {new Date(formData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Збереження..." : "💾 Зберегти зміни"}
          </button>
          
          <Link href="/admin/products">
            <button type="button" className="px-6 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              ❌ Скасувати
            </button>
          </Link>
        </div>
      </form>
    </Container>
  );
}