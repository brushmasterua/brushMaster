import { Container } from "@/components/shared/container";
import Link from "next/link";
import { 
  Package, 
  ShoppingBag, 
  Tag, 
  BarChart3, 
  LogOut,
  TrendingUp,
  Users,
  Eye,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const stats = {
    products: 156,
    orders: 48,
    categories: 8,
    revenue: 12450,
    views: 3250,
    users: 127,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* 🔥 background glow - покращено */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_0%,rgba(249,115,22,0.12),transparent_60%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_100%,rgba(249,115,22,0.08),transparent_55%)]" />

      <Container className="py-10">

        {/* 🔹 Header - покращений */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#f97316] to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="w-1 h-8 bg-[#f97316] rounded-full" />
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Адмін-панель
              </h1>
            </div>
            <p className="text-gray-500 ml-16">
              Ласкаво просимо, <span className="font-medium text-gray-700">{session.user?.email || "Admin"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/70 backdrop-blur rounded-full border border-gray-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-500">Система активна</span>
            </div>
            
            <form action="/api/auth/signout" method="POST">
              <button className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white/70 backdrop-blur hover:bg-[#f97316] hover:border-[#f97316] hover:text-white transition-all duration-300 shadow-sm cursor-pointer">
                <LogOut className="w-4 h-4 group-hover:scale-110 transition" />
                <span className="text-sm font-medium">Вийти</span>
              </button>
            </form>
          </div>
        </div>

        {/* 🔹 Stats - покращена сітка та візуал */}
        {/* TODO: Розкоментувати після налаштування реальних даних
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-[#f97316] rounded-full" />
              <h2 className="text-lg font-semibold text-gray-700">Огляд магазину</h2>
            </div>
            <span className="text-xs text-gray-400">оновлено: сьогодні</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Товари *}
            <div className="group relative rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-orange-500/5 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Package className="w-6 h-6 text-[#f97316]" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
                  <p className="text-gray-500 text-sm">Товарів</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
            </div>

            {/* Замовлення *}
            <div className="group relative rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/5 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
                  <p className="text-gray-500 text-sm">Замовлень</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8%</span>
                </div>
              </div>
            </div>

            {/* Категорії *}
            <div className="group relative rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/5 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <Tag className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.categories}</p>
                  <p className="text-gray-500 text-sm">Категорій</p>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  <span>8 активних</span>
                </div>
              </div>
            </div>

            {/* Дохід *}
            <div className="group relative rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-emerald-500/5 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.revenue.toLocaleString()} ₴</p>
                  <p className="text-gray-500 text-sm">Дохід</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>+23%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Додаткові метрики *}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Переглядів</p>
                  <p className="text-xl font-bold text-gray-800">{stats.views.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+5% цього тижня</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/60 backdrop-blur rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Користувачів</p>
                  <p className="text-xl font-bold text-gray-800">{stats.users}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>+15%</span>
              </div>
            </div>
          </div>
        </div>
        */}

        {/* 🔹 Actions - покращені */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-[#f97316] rounded-full" />
            <h2 className="text-lg font-semibold text-gray-700">Управління</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {[
              {
                href: "/admin/products",
                icon: Package,
                title: "Товари",
                desc: "Додавання, редагування, видалення товарів",
                color: "from-orange-50 to-orange-100/30",
                iconColor: "text-[#f97316]",
                bgIcon: "bg-orange-100"
              },
              {
                href: "/admin/orders",
                icon: ShoppingBag,
                title: "Замовлення",
                desc: "Перегляд та управління замовленнями",
                color: "from-blue-50 to-blue-100/30",
                iconColor: "text-blue-600",
                bgIcon: "bg-blue-100"
              },
              {
                href: "/admin/categories",
                icon: Tag,
                title: "Категорії",
                desc: "Управління категоріями товарів",
                color: "from-purple-50 to-purple-100/30",
                iconColor: "text-purple-600",
                bgIcon: "bg-purple-100"
              },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group relative rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* hover gradient background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br ${item.color}`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${item.bgIcon} rounded-xl flex items-center justify-center mb-4 transition group-hover:scale-110 duration-300`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h2>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="flex items-center gap-1 mt-4 text-sm font-medium text-[#f97316] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    <span>Керувати</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}

          </div>
        </div>

      </Container>
    </div>
  );
}