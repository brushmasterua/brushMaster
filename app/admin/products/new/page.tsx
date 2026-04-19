"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    oldPrice: "",
    stock: "",
    image: "",
    imagePublicId: "",
    categoryId: "",
    isNew: false,
    isHit: false,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    
    // Автоматична генерація slug при зміні назви
    if (name === "name") {
      const slug = generateSlug(value);
      if (slug) {
        setTimeout(() => {
          setFormData(prev => ({ ...prev, slug }));
        }, 0);
      }
    }
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData(prev => ({
      ...prev,
      image: url,
      imagePublicId: publicId,
    }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      image: "",
      imagePublicId: "",
    }));
  };

  const handleGenerateSlug = () => {
    if (!formData.name) return;
    const slug = generateSlug(formData.name);
    if (slug) {
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push("/admin/products");
      } else {
        const error = await response.json();
        alert(error.error || "Помилка при створенні товару");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при створенні товару");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Додати товар</h1>
          <p className="text-gray-500 text-sm">Заповніть інформацію про новий товар</p>
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
                placeholder="avtomatichno-generuetsya"
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
            value={formData.description}
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
              value={formData.oldPrice}
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
              <option value="">Виберіть категорію</option>
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

        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
              className="w-4 h-4 accent-[#f97316] cursor-pointer"
            />
            <span className="text-sm">Новинка (NEW)</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isHit"
              checked={formData.isHit}
              onChange={handleChange}
              className="w-4 h-4 accent-[#f97316] cursor-pointer"
            />
            <span className="text-sm">Хіт продажів</span>
          </label>
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
          
          <Link href="/admin/products">
            <button type="button" className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer">
              Скасувати
            </button>
          </Link>
        </div>
      </form>
    </Container>
  );
}