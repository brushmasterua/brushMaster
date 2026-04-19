"use client";

import { useState } from "react";
import { Container } from "@/components/shared/container";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setMessage("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Дякуємо! Ваше повідомлення відправлено. Ми зв'яжемося з вами найближчим часом.");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setMessage(data.error || "Щось пішло не так. Спробуйте пізніше");
      }
    } catch (error) {
      console.error("Помилка:", error);
      setStatus("error");
      setMessage("Помилка з'єднання. Спробуйте пізніше");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секція */}
      <Container className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Контактна інформація */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Контактна інформація</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Адреса</h3>
                    <p className="text-gray-600 text-sm">Чернівецька область, село Іспас</p>
                    <p className="text-gray-600 text-sm">Україна</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Телефон</h3>
                    <a href="tel:+380974570352" className="text-gray-600 text-sm hover:text-[#f97316] transition">
                      +380 97 457 03 52
                    </a>
                    <p className="text-xs text-gray-400 mt-1">Пн-Пт: 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:brushmaster.ua@gmail.com" className="text-gray-600 text-sm hover:text-[#f97316] transition">
                      brushmaster.ua@gmail.com
                    </a>
                    <p className="text-xs text-gray-400 mt-1">Відповідаємо протягом 24 годин</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Графік роботи</h3>
                    <p className="text-gray-600 text-sm">Понеділок - П'ятниця: 9:00 - 18:00</p>
                    <p className="text-gray-600 text-sm">Субота: 10:00 - 15:00</p>
                    <p className="text-gray-600 text-sm">Неділя: Вихідний</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Соціальні мережі */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Ми в соцмережах</h2>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#f97316] hover:text-white transition group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#f97316] hover:text-white transition group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#f97316] hover:text-white transition group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.683-12.056c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Форма зворотного зв'язку */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-2">Напишіть нам</h2>
              <p className="text-gray-500 mb-6">
                Заповніть форму нижче, і ми відповімо вам найближчим часом
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ваше ім'я <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition"
                      placeholder="Іван Петренко"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition"
                      placeholder="ivan@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition"
                    placeholder="+380 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Повідомлення <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316] transition resize-none"
                    placeholder="Опишіть ваше питання або побажання..."
                  />
                </div>

                {message && (
                  <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>
                    {status === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full md:w-auto px-8 py-3 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    "Відправка..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Надіслати повідомлення
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Карта */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Ми на карті</h2>
              <div className="rounded-xl overflow-hidden h-[300px] bg-gray-100">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2718.987654321!2d25.281234!3d48.291234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4732a1234567890b%3A0x1234567890abcdef!2z0KHRgdC_0LDRgSDRhtC10L3RgtGA!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Мапа с. Іспас, Чернівецька область"
/>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}