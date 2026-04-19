"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Truck, CreditCard, MapPin, Phone, Mail, Package, CheckCircle, XCircle, Clock } from "lucide-react";
import { Container } from "@/components/shared/container";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    slug: string;
    image: string;
  };
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  customerCity: string;
  customerAddress: string;
  deliveryMethod: string;
  paymentMethod: string;
  comment: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-5 h-5" />,
  PAID: <CreditCard className="w-5 h-5" />,
  SHIPPED: <Truck className="w-5 h-5" />,
  DELIVERED: <CheckCircle className="w-5 h-5" />,
  CANCELLED: <XCircle className="w-5 h-5" />,
};

const deliveryMethodLabels: Record<string, string> = {
  nova: "Нова Пошта",
  ukrposhta: "Укрпошта",
  courier: "Кур'єр",
};

const paymentMethodLabels: Record<string, string> = {
  card: "Карткою онлайн",
  cash: "Готівкою при отриманні",
};

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);
      const data = await response.json();
      setOrder(data);
      setSelectedStatus(data.status);
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async () => {
    if (!order || selectedStatus === order.status) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      
      if (response.ok) {
        setOrder({ ...order, status: selectedStatus });
      } else {
        alert("Помилка оновлення статусу");
      }
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка оновлення статусу");
    } finally {
      setUpdating(false);
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

  if (loading) {
    return (
      <Container className="py-8">
        <div className="text-center text-gray-500">Завантаження...</div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="py-8">
        <div className="text-center text-red-500">Замовлення не знайдено</div>
      </Container>
    );
  }

  return (
    <Container className="py-4 md:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Замовлення {order.orderNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Створено {formatDate(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основна інформація */}
        <div className="lg:col-span-2 space-y-6">
          {/* Статус */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Статус замовлення</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${statusColors[order.status]}`}>
                {statusIcons[order.status]}
                <span className="font-medium">
                  {order.status === "PENDING" ? "Нове" :
                   order.status === "PAID" ? "Оплачено" :
                   order.status === "SHIPPED" ? "Відправлено" :
                   order.status === "DELIVERED" ? "Доставлено" : "Скасовано"}
                </span>
              </div>
              
              <div className="flex-1 flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
                >
                  <option value="PENDING">Нове</option>
                  <option value="PAID">Оплачено</option>
                  <option value="SHIPPED">Відправлено</option>
                  <option value="DELIVERED">Доставлено</option>
                  <option value="CANCELLED">Скасовано</option>
                </select>
                <button
                  onClick={updateStatus}
                  disabled={updating || selectedStatus === order.status}
                  className="px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  {updating ? "Збереження..." : "Оновити"}
                </button>
              </div>
            </div>
          </div>

          {/* Товари */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Товари</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-3 border-b last:border-0">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Link href={`/product/${item.product.slug}`} target="_blank">
                      <h3 className="font-medium hover:text-[#f97316] transition">
                        {item.product.name}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-500">
                        {item.quantity} шт. × {item.price.toLocaleString()} ₴
                      </span>
                      <span className="font-bold text-[#f97316]">
                        {(item.quantity * item.price).toLocaleString()} ₴
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Коментар */}
          {order.comment && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-4">Коментар клієнта</h2>
              <p className="text-gray-600">{order.comment}</p>
            </div>
          )}
        </div>

        {/* Бокова панель */}
        <div className="space-y-6">
          {/* Інформація про клієнта */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Клієнт</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${order.customerPhone}`} className="text-gray-600 hover:text-[#f97316]">
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${order.customerEmail}`} className="text-gray-600 hover:text-[#f97316]">
                    {order.customerEmail}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {order.customerCity}, {order.customerAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Доставка та оплата */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Доставка та оплата</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Спосіб доставки:</span>
                <span className="font-medium">{deliveryMethodLabels[order.deliveryMethod]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Спосіб оплати:</span>
                <span className="font-medium">{paymentMethodLabels[order.paymentMethod]}</span>
              </div>
            </div>
          </div>

          {/* Підсумок */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Підсумок</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Товари:</span>
                <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} шт.</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Всього:</span>
                <span className="text-[#f97316]">{order.total.toLocaleString()} ₴</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}