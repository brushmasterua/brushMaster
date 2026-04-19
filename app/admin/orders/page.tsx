"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Eye, 
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Phone,
  Calendar,
  CreditCard,
  Download,
  Plus,
  ArrowLeft
} from "lucide-react";
import { Container } from "@/components/shared/container";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  status: string;
  createdAt: string;
  itemsCount: number;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  PENDING: "Нове",
  PAID: "Оплачено",
  SHIPPED: "Відправлено",
  DELIVERED: "Доставлено",
  CANCELLED: "Скасовано",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", currentPage.toString());
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setTotalOrders(data.total || 0);
    } catch (error) {
      console.error("Помилка:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${deleteId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setOrders(orders.filter(o => o.id !== deleteId));
        setDeleteId(null);
      } else {
        alert("Помилка при видаленні замовлення");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при видаленні замовлення");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);
      
      const response = await fetch(`/api/admin/orders/export?${params.toString()}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders_${new Date().toISOString().split("T")[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(error.error || "Помилка експорту");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка при експорті замовлень");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!Array.isArray(orders)) {
    return (
      <Container className="py-4 md:py-8">
        <div className="text-center text-gray-500">Помилка завантаження даних</div>
      </Container>
    );
  }

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
        <h1 className="text-2xl md:text-3xl font-bold">Замовлення</h1>
          <p className="text-gray-500 text-sm mt-1">Управління замовленнями магазину</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Експорт..." : "Excel"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Пошук за номером, іменем або телефоном..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] text-sm md:text-base"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] bg-white text-sm md:text-base"
          >
            <option value="all">Всі статуси</option>
            <option value="PENDING">Нові</option>
            <option value="PAID">Оплачені</option>
            <option value="SHIPPED">Відправлені</option>
            <option value="DELIVERED">Доставлені</option>
            <option value="CANCELLED">Скасовані</option>
          </select>
        </div>
      </div>

      {/* Десктопна таблиця */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Завантаження...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Замовлення не знайдені</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium">№ замовлення</th>
                    <th className="text-left p-4 text-sm font-medium">Клієнт</th>
                    <th className="text-left p-4 text-sm font-medium">Сума</th>
                    <th className="text-left p-4 text-sm font-medium">Статус</th>
                    <th className="text-left p-4 text-sm font-medium">Дата</th>
                    <th className="text-left p-4 text-sm font-medium">Товарів</th>
                    <th className="text-left p-4 text-sm font-medium">Дії</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium">{order.orderNumber}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{order.customerName || "—"}</p>
                          <p className="text-xs text-gray-500">{order.customerPhone || "—"}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-[#f97316]">{order.total.toLocaleString()} ₴</span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}>
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {order.itemsCount} шт.
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/orders/${order.id}`}>
                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Переглянути">
                              <Eye className="w-4 h-4 text-blue-500" />
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteId(order.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            title="Видалити"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагінація */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 border-t">
                <p className="text-sm text-gray-500">
                  Всього: {totalOrders} замовлень
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="py-2 px-4 text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Мобільні картки */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Завантаження...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Замовлення не знайдені</p>
          </div>
        ) : (
          <>
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-mono text-sm font-bold text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.customerName || "—"}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{order.customerPhone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{order.itemsCount} товарів</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-[#f97316]">{order.total.toLocaleString()} ₴</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <Link href={`/admin/orders/${order.id}`} className="flex-1">
                    <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      Переглянути
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Видалити
                  </button>
                </div>
              </div>
            ))}

            {/* Пагінація на мобільних */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="py-2 px-4 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-50 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

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
              Ви впевнені, що хочете видалити це замовлення? Цю дію не можна скасувати.
              <br />
              <span className="text-sm text-gray-400">Всі товари в замовленні також будуть видалені.</span>
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