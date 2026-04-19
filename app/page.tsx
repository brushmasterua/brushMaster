// app/page.tsx
import { Suspense } from "react";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import Baner from "@/components/widgets/baner";
import { CategoriesWrapper } from "@/components/shared/categories-wrapper";
import Catalog from "@/components/shared/catalog";


export default function Home() {
  return (
    <>
      <Baner />
      <Container>
        <div id="catalog">
          <Title text="Каталог товарів" size="lg" className="font-bold py-6" />
          <Suspense fallback={<div className="h-11 bg-gray-200 rounded-xl animate-pulse" />}>
            <CategoriesWrapper />
          </Suspense>
          <Suspense fallback={null}>  {/* ← Suspense все одно потрібен */}
            <Catalog />
          </Suspense>
        </div>
      </Container>
    </>
  );
}