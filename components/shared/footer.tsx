import React from "react";
import { Container } from "./container";
import Link from "next/link";
import { SubscriptionForm } from "./subscription-form";
import {
  PaintbrushVertical,
//   Instagram,
//   Facebook,
  Phone,
  Mail,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-15 text-white">

      {/* 🔥 Glow background */}
      <div className="absolute inset-0 -z-10 bg-black" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.25),transparent_60%)]" />

      <Container className="py-16">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* 🔹 Бренд */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <PaintbrushVertical color="#f97316" size={34} />
              <h1 className="text-2xl font-black tracking-tight">
                Brush<span className="text-[#f97316]">Master</span>
              </h1>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              Професійні інструменти для фарбування. Створені для майстрів, які цінують якість.
            </p>

            {/* 🔥 Social */}
            <div className="flex gap-3 pt-2">
              <div className="p-2 rounded-xl bg-white/5 hover:bg-[#f97316] transition cursor-pointer">
                {/* <Instagram size={18} /> */}
              </div>
              <div className="p-2 rounded-xl bg-white/5 hover:bg-[#f97316] transition cursor-pointer">
                {/* <Facebook size={18} /> */}
              </div>
            </div>
          </div>

          {/* 🔹 Навігація */}
          <div>
            <h3 className="font-semibold mb-5 text-white/90">Навігація</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="hover:text-[#f97316] transition cursor-pointer">
                 <Link  href="#catalog" scroll={true}>Каталог</Link>
                </li>
              <li className="hover:text-[#f97316] transition cursor-pointer">
                <Link href="/delivery" className="hover:text-[#f97316] transition">Доставка</Link>
                </li>
              <li className="hover:text-[#f97316] transition cursor-pointer">
                <Link href="/cart" className="hover:text-[#f97316] transition"> Кошик</Link>
              </li>
              <li className="hover:text-[#f97316] transition cursor-pointer">
                <Link href="/contact" className="hover:text-[#f97316] transition"> Контакти</Link>
              </li>
            </ul>
          </div>

          {/* 🔹 Контакти */}
          <div>
  <h3 className="font-semibold mb-5 text-white/90">Контакти</h3>
  <ul className="space-y-4 text-sm text-gray-400">

    <li>
      <a 
        href="tel:+380974570352" 
        className="flex items-center gap-3 hover:text-white transition"
      >
        <Phone size={16} />
        +380 97 457 03 52
      </a>
    </li>

    <li>
      <a 
        href="mailto:brushmaster.ua@gmail.com" 
        className="flex items-center gap-3 hover:text-white transition"
      >
        <Mail size={16} />
        brushmaster.ua@gmail.com
      </a>
    </li>

  </ul>
</div>

          {/* 🔹 Підписка */}
          <SubscriptionForm/>

        </div>

        {/* 🔻 Bottom */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BrushMaster</p>

          <div className="flex gap-5">
            <span className="hover:text-white transition cursor-pointer">
               <Link href="/privacy" className="hover:text-[#f97316] transition">Privacy</Link>
            </span>
            <span className="hover:text-white transition cursor-pointer">
                <Link href="/terms" className="hover:text-[#f97316] transition">Terms</Link>
            </span>
            <span className="hover:text-white transition cursor-pointer">
                <Link href="/delivery" className="hover:text-[#f97316] transition">Delivery</Link>
            </span>
          </div>
        </div>

      </Container>
    </footer>
  );
};