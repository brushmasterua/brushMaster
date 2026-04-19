"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  X,
  LayoutGrid,
  List,
  ArrowLeft
} from "lucide-react";
import { Container } from "@/components/shared/container";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  image: string;
  categoryId: number;
  category: Category;
  isNew: boolean;
  isHit: boolean;
  createdAt: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
  const itemsPerPage = 12;

  // Завантаження збереженого режиму перегляду
  useEffect(() => {
    const savedViewMode = localStorage.getItem("admin-products-view-mode");
    if (savedViewMode === "table" || savedViewMode === "grid") {
      setViewMode(savedViewMode);
    }
    
    // На мобільних пристроях завжди картки
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setViewMode("grid");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Збереження режиму перегляду
  const handleViewModeChange = (mode: "table" | "grid") => {
    if (window.innerWidth >= 768 || mode === "grid") {
      setViewMode(mode);
      localStorage.setItem("admin-products-view-mode", mode);
    }
  };

  // Завантаження товарів
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory !== "all") params.set("categoryId", selectedCategory);
      
      const response = await fetch(`/api/admin/products?${params.toString()}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setLoading(false);
    }
  };

  // Завантаження категорій
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Помилка:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, selectedCategory]);

  // Видалення товару
  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/admin/products?id=${deleteId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== deleteId));
        setDeleteId(null);
      } else {
        alert("Помилка при видаленні товару");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при видаленні товару");
    }
  };

  // Пагінація
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Компонент картки товару
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/admin/products/${product.id}/edit`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {product.isNew && (
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-lg">NEW</span>
            )}
            {product.isHit && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-lg">ХІТ</span>
            )}
          </div>
          {product.oldPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/admin/products/${product.id}/edit`}>
          <h3 className="font-medium text-gray-900 hover:text-[#f97316] transition line-clamp-2 min-h-[48px]">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-400 mt-1">{product.category?.name}</p>
        
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-[#f97316]">{product.price} ₴</span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">{product.oldPrice} ₴</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className={`text-xs ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `В наявності (${product.stock} шт.)` : "Немає"}
          </span>
          <div className="flex gap-1">
            <Link href={`/product/${product.slug}`} target="_blank">
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Переглянути">
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </Link>
            <Link href={`/admin/products/${product.id}/edit`}>
              <button className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Редагувати">
                <Edit className="w-4 h-4 text-blue-500" />
              </button>
            </Link>
            <button
              onClick={() => setDeleteId(product.id)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition"
              title="Видалити"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Компонент рядка таблиці
  const ProductRow = ({ product }: { product: Product }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3">
        <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
      </td>
      <td className="p-3">
        <p className="font-medium text-sm">{product.name}</p>
        <p className="text-xs text-gray-400">{product.slug}</p>
      </td>
      <td className="p-3">
        <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs">
          {product.category?.name}
        </span>
      </td>
      <td className="p-3">
        <p className="font-bold text-[#f97316] text-sm">{product.price} ₴</p>
        {product.oldPrice && (
          <p className="text-xs text-gray-400 line-through">{product.oldPrice} ₴</p>
        )}
      </td>
      <td className="p-3">
        <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
          {product.stock > 0 ? `${product.stock} шт.` : "Немає"}
        </span>
      </td>
      <td className="p-3">
        <div className="flex gap-1">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-lg">NEW</span>
          )}
          {product.isHit && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-lg">ХІТ</span>
          )}
        </div>
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          <Link href={`/product/${product.slug}`} target="_blank">
            <button className="p-1 hover:bg-gray-100 rounded-lg transition">
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
          </Link>
          <Link href={`/admin/products/${product.id}/edit`}>
            <button className="p-1 hover:bg-gray-100 rounded-lg transition">
              <Edit className="w-4 h-4 text-blue-500" />
            </button>
          </Link>
          <button onClick={() => setDeleteId(product.id)} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </td>
    </tr>
  );

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
          <h1 className="text-2xl md:text-3xl font-bold">Товари</h1>
          <p className="text-gray-500 text-sm mt-1">Управління товарами магазину</p>
        </div>
                </div>
        
        
        <div className="flex gap-2">
          {/* Перемикач вигляду (тільки на десктопі) */}
          <div className="hidden md:flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-2 rounded-lg transition cursor-pointer ${
                viewMode === "grid" ? "bg-white shadow-sm text-[#f97316]" : "text-gray-500 hover:text-gray-700"
              }`}
              title="Картки"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleViewModeChange("table")}
              className={`p-2 rounded-lg transition cursor-pointer ${
                viewMode === "table" ? "bg-white shadow-sm text-[#f97316]" : "text-gray-500 hover:text-gray-700"
              }`}
              title="Таблиця"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Link href="/admin/products/new">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl transition cursor-pointer">
              <Plus className="w-4 h-4" />
              Додати товар
            </button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук товарів..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] bg-white"
          >
            <option value="all">Всі категорії</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products View */}
      {loading ? (
        <div className="text-center text-gray-500 py-12">Завантаження...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Товари не знайдені</p>
          <Link href="/admin/products/new">
            <button className="mt-4 px-4 py-2 bg-[#f97316] text-white rounded-xl">
              Додати перший товар
            </button>
          </Link>
        </div>
      ) : (
        <>
          {/* Режим карток (завжди на мобільних) */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Режим таблиці (тільки на десктопі) */}
          {viewMode === "table" && (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Фото</th>
                    <th className="text-left p-3 text-sm font-medium">Назва</th>
                    <th className="text-left p-3 text-sm font-medium">Категорія</th>
                    <th className="text-left p-3 text-sm font-medium">Ціна</th>
                    <th className="text-left p-3 text-sm font-medium">Наявність</th>
                    <th className="text-left p-3 text-sm font-medium">Статус</th>
                    <th className="text-left p-3 text-sm font-medium">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <ProductRow key={product.id} product={product} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Пагінація */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg transition cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#f97316] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Підтвердження видалення</h2>
              <button onClick={() => setDeleteId(null)} className="p-1 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Ви впевнені, що хочете видалити цей товар? Цю дію не можна скасувати.
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
          </div>
        </div>
      )}
    </Container>
  );
}