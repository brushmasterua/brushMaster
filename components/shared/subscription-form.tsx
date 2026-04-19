"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export function SubscriptionForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Будь ласка, введіть коректну email адресу");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Дякуємо! Ми зв'яжемося з вами найближчим часом");
        setEmail("");
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
    <div>
      <h3 className="font-semibold mb-5 text-white/90">
        Залиште свою пошту
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        Ми зв'яжемось з вами найближчим часом
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/5 rounded-xl overflow-hidden border border-white/10 focus-within:border-[#f97316] transition">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ваш Email"
            disabled={status === "loading"}
            className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-3 bg-[#f97316] hover:bg-orange-500 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "..." : "Ок"}
          </button>
        </div>

        {message && (
          <div className={`mt-3 text-sm flex items-center gap-2 ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}>
            {status === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {message}
          </div>
        )}
      </form>
    </div>
  );
}