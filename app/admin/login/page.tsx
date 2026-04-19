"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin/dashboard",
      });

      console.log("Результат авторизації:", result);

      if (result?.error) {
        setError("Невірний email або пароль");
      } else if (result?.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Помилка:", error);
      setError("Помилка при вході");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-16 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Адмін-панель</h1>
          <p className="text-gray-500 mt-2">Вхід для адміністратора</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f97316]"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f97316] hover:bg-orange-600 cursor-pointer"
          >
            {loading ? "Вхід..." : "Увійти"}
          </Button>
        </form>
      </div>
    </Container>
  );
}