import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import Link from "next/link";

export default function Baner() {
  return (
    <section className="w-full">
      <Container>
        
        {/* Wrapper для бордера */}
        <div className="relative p-[5px] rounded-2xl overflow-hidden">

          {/* 🔥 Спінер бордера */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div 
              className="absolute inset-[-100%] bg-[conic-gradient(#00000000,#f97316)]" 
              style={{ animation: 'spin 4s linear infinite' }}
            />
          </div>

          {/* Основний банер */}
          <div className="relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden bg-black">

            {/* Фон */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{ backgroundImage: "url('/mainBaner.jpg')" }}
            />

            {/* Градієнт */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-black/70 to-transparent" />

            {/* Glow */}
            <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-orange-500/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-orange-400/20 blur-[100px] rounded-full" />

            {/* Контент */}
            <div className="relative z-10 flex h-full items-center px-6 md:px-12">
              <div className="max-w-xl space-y-6">

                <div className="inline-block px-4 py-1 text-sm bg-orange-500/20 text-[#f97316] rounded-full border border-orange-400/30">
                  🔥 Топ якість для професіоналів
                </div>

                <h1 className="text-3xl md:text-6xl font-extrabold text-white leading-tight">
                  Пензлі, що фарбують 
                  <span className="text-[#f97316]"> ідеально</span>
                </h1>

                <p className="text-white/80 text-base md:text-lg">
                  Обирай інструменти, якими працюють професіонали.
                  Чистий результат без зайвих зусиль.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <Link href="/contact">
                    <Button className="bg-[#f97316] hover:bg-orange-400 text-white px-6 py-4 text-base rounded-xl shadow-lg shadow-orange-500/30 cursor-pointer">
                      Контакти
                    </Button>
                  </Link>

                  <Link  href="#catalog" scroll={true}>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 px-6 py-4 rounded-xl cursor-pointer"
                    >
                      Дивитись каталог
                    </Button>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}