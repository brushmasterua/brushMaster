"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  X,
  FolderTree,
  ArrowLeft
} from "lucide-react";
import { Container } from "@/components/shared/container";

interface Category {
  id: number;
  name: string;
  slug: string;
  productsCount: number;
  createdAt: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Завантаження категорій
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      
      const response = await fetch(`/api/admin/categories?${params.toString()}`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  // Видалення категорії
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/admin/categories?id=${deleteId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setCategories(categories.filter(c => c.id !== deleteId));
        setDeleteId(null);
        setDeleteError(null);
      } else {
        setDeleteError(data.error);
      }
    } catch (error) {
      console.error("Помилка:", error);
      setDeleteError("Помилка при видаленні категорії");
    }
  };

  return (
    <Container className="py-4 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 mb-6">
                <Link href="/admin">
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </Link>
                <div>
          <h1 className="text-2xl md:text-3xl font-bold">Категорії</h1>
          <p className="text-gray-500 text-sm mt-1">Управління категоріями товарів</p>
        </div>
                </div>
        
        
        <Link href="/admin/categories/new">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl transition cursor-pointer text-sm md:text-base">
            <Plus className="w-4 h-4" />
            Додати категорію
          </button>
        </Link>
      </div>

      {/* Пошук */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук категорій..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] text-sm md:text-base"
          />
        </div>
      </div>

      {/* Десктопна таблиця (ховається на мобільних) */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Завантаження...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Категорії не знайдені</p>
            <Link href="/admin/categories/new">
              <button className="mt-4 px-4 py-2 bg-[#f97316] text-white rounded-xl">
                Додати першу категорію
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 text-sm font-medium">Назва</th>
                  <th className="text-left p-4 text-sm font-medium">Slug</th>
                  <th className="text-left p-4 text-sm font-medium">Товарів</th>
                  <th className="text-left p-4 text-sm font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <span className="font-medium">{category.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-500">{category.slug}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-600">{category.productsCount} шт.</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/categories/${category.id}/edit`}>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                            <Edit className="w-4 h-4 text-blue-500" />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(category.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                          disabled={category.productsCount > 0}
                          title={category.productsCount > 0 ? "Неможливо видалити категорію з товарами" : "Видалити"}
                        >
                          <Trash2 className={`w-4 h-4 ${category.productsCount > 0 ? "text-gray-300" : "text-red-500"}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Мобільні картки (показуються тільки на мобільних) */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Завантаження...</div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Категорії не знайдені</p>
            <Link href="/admin/categories/new">
              <button className="mt-4 px-4 py-2 bg-[#f97316] text-white rounded-xl text-sm">
                Додати першу категорію
              </button>
            </Link>
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-[#f97316]" />
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{category.slug}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                    {category.productsCount} товарів
                  </span>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <Link href={`/admin/categories/${category.id}/edit`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition text-sm font-medium">
                      <Edit className="w-4 h-4" />
                      Редагувати
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    disabled={category.productsCount > 0}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition text-sm font-medium ${
                      category.productsCount > 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    title={category.productsCount > 0 ? "Неможливо видалити категорію з товарами" : "Видалити"}
                  >
                    <Trash2 className="w-4 h-4" />
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Підтвердження видалення</h2>
              <button onClick={() => { setDeleteId(null); setDeleteError(null); }} className="p-1 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {deleteError ? (
              <>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-600 text-sm">{deleteError}</p>
                </div>
                <button
                  onClick={() => { setDeleteId(null); setDeleteError(null); }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition cursor-pointer"
                >
                  Закрити
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Ви впевнені, що хочете видалити цю категорію? Цю дію не можна скасувати.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition cursor-pointer"
                  >
                    Видалити
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    Скасувати
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}