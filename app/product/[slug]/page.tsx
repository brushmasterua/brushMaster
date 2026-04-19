import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Truck, CreditCard, RotateCcw, Shield, Clock, Star } from "lucide-react";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Допоміжна функція для конвертації Decimal в number
function transformProduct(product: any) {
  return {
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  const productRaw = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!productRaw) {
    notFound();
  }

  const product = transformProduct(productRaw);

  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Container >
      {/* Навігація */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#f97316] transition mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* Ліва колонка - Зображення */}
        <div className="relative">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
                -{discountPercent}%
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 right-4 bg-[#f97316] text-white px-3 py-1.5 rounded-full text-sm font-medium">
                New
              </div>
            )}
          </div>
          
          {/* Мініатюри (поки що одне фото) */}
          {/* <div className="flex gap-3 mt-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#f97316]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </div> */}
        </div>

        {/* Права колонка - Інформація */}
        <div className="flex flex-col gap-6">
          {/* Категорія */}
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-gray-400 uppercase tracking-wide">
              {product.category?.name}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-400">Арт. {product.id}</span>
          </div>

          {/* Назва */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Рейтинг */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            {/* <span className="text-sm text-gray-400">( 12 )</span> */}
          </div>

          {/* Ціна */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#f97316]">
              {product.price.toLocaleString()} ₴
            </span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                {product.oldPrice.toLocaleString()} ₴
              </span>
            )}
          </div>

          {/* Опис */}
          {product.description && (
            <div className="text-gray-600 text-base leading-relaxed border-t border-gray-100 pt-6">
              <p>{product.description}</p>
            </div>
          )}

          {/* Наявність */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">В наявності</span>
                <span className="text-sm text-gray-400">• {product.stock} шт.</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm text-red-500">Немає в наявності</span>
              </>
            )}
          </div>

          {/* Кнопка додавання в кошик */}
          <AddToCartButton product={product} />

          {/* Переваги */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Truck className="w-4 h-4 text-[#f97316]" />
              </div>
              <div>
                <p className="font-medium">Вигідні умови доставки</p>
                <p className="text-xs text-gray-400">по всій Україні</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#f97316]" />
              </div>
              <div>
                <p className="font-medium">Оплата при отриманні</p>
                <p className="text-xs text-gray-400">або карткою</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-[#f97316]" />
              </div>
              <div>
                <p className="font-medium">Повернення 14 днів</p>
                <p className="text-xs text-gray-400">за законом</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#f97316]" />
              </div>
              <div>
                <p className="font-medium">Гарантія якості</p>
                <p className="text-xs text-gray-400">100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Характеристики - окремий блок */}
      <div className="pt-10 lg:pt-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[#f97316] rounded-full" />
          <h2 className="text-xl font-semibold text-gray-900">Характеристики</h2>
        </div>
        
        <div className="bg-gray-100 rounded-2xl p-6 md:p-8">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex py-3 border-b border-gray-200">
              <dt className="w-32 text-sm text-gray-500">Категорія</dt>
              <dd className="flex-1 text-sm font-medium text-gray-900">{product.category?.name}</dd>
            </div>
            <div className="flex py-3 border-b border-gray-200">
              <dt className="w-32 text-sm text-gray-500">Артикул</dt>
              <dd className="flex-1 text-sm font-medium text-gray-900">{product.id}</dd>
            </div>
            <div className="flex py-3 border-b border-gray-200">
              <dt className="w-32 text-sm text-gray-500">Наявність</dt>
              <dd className="flex-1 text-sm font-medium text-gray-900">
                {product.stock > 0 ? `${product.stock} шт.` : "Немає в наявності"}
              </dd>
            </div>
            
            <div className="flex py-3">
              <dt className="w-32 text-sm text-gray-500">Країна виробництва</dt>
              <dd className="flex-1 text-sm font-medium text-gray-900">Україна</dd>
            </div>
          </dl>
        </div>
      </div>
    </Container>
  );
}