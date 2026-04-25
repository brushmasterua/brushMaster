"use client";

import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

export function CallButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Показуємо кнопку після прокрутки 300px
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleCall = () => {
    window.location.href = "tel:+380974570352";
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16 pointer-events-none"
      }`}
    >
      <button
        onClick={handleCall}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#f97316] to-orange-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        {/* Пульсуюче кільце */}
        <span className="absolute inset-0 rounded-full animate-ping bg-[#f97316] opacity-30" />
        
        {/* Додаткове кільце для ефекту */}
        <span className="absolute inset-0 rounded-full animate-pulse bg-[#f97316] opacity-20" />
        
        {/* Іконка телефону */}
        <Phone className="w-6 h-6 text-white relative z-10" />
        
        {/* Текст, що з'являється при наведенні */}
        <span
          className={`absolute right-full mr-3 whitespace-nowrap bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg transition-all duration-300 ${
            isHovered
              ? "opacity-100 translate-x-0 visible"
              : "opacity-0 translate-x-2 invisible"
          }`}
        >
          Зателефонувати
          {/* Трикутник */}
          <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
        </span>
      </button>
    </div>
  );
}