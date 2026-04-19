import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Додаємо категорії
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Малярні', slug: 'paint' },
      { name: 'Флейцеві', slug: 'flat' },
      { name: 'Круглі', slug: 'round' },
      { name: 'Кутові', slug: 'angle' },
      { name: 'Радіаторні', slug: 'radiator' },
      { name: 'Валики', slug: 'rollers' },
      { name: 'Набори', slug: 'sets' },
      { name: 'Аксесуари', slug: 'accessories' },
    ],
  })
  console.log('✅ Категорії додано')

  // 2. Отримуємо ID категорій для зв'язку з товарами
  const allCategories = await prisma.category.findMany()
  const categoryMap: Record<string, number> = {}
  allCategories.forEach((cat) => {
    categoryMap[cat.name] = cat.id
  })

  // 3. Додаємо тестові товари
  await prisma.product.createMany({
    data: [
      {
        name: 'Пензель малярний флейцевий 50мм',
        slug: 'penzel-fleyceviy-50mm',
        price: 89,
        oldPrice: 120,
        stock: 25,
        image: '/products/product1.jpg',
        categoryId: categoryMap['Флейцеві'],
        isHit: true,
      },
      {
        name: 'Набір пензлів для фарбування 5шт',
        slug: 'nabor-penzliv-5sht',
        price: 299,
        stock: 10,
        image: '/products/product2.webp',
        categoryId: categoryMap['Набори'],
        isNew: true,
      },
      {
        name: 'Валик велюровий 250мм',
        slug: 'valyk-velyurovyy-250mm',
        price: 159,
        oldPrice: 199,
        stock: 0,
        image: '/products/product3.webp',
        categoryId: categoryMap['Валики'],
      },
      {
        name: 'Пензель кутовий 40мм',
        slug: 'penzel-kutoviy-40mm',
        price: 69,
        stock: 50,
        image: '/products/product4.webp',
        categoryId: categoryMap['Кутові'],
      },
      {
        name: 'Радіаторний пензель зігнутий',
        slug: 'radiatornyy-penzel',
        price: 119,
        stock: 15,
        image: '/products/product2.webp',
        categoryId: categoryMap['Радіаторні'],
        isHit: true,
      },
    ],
  })
  console.log('✅ Товари додано')
}

main()
  .catch((e) => {
    console.error('❌ Помилка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })