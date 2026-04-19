import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const isAdmin = token?.role === "admin";
      const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = req.nextUrl.pathname === "/admin/login";
      
      // Дозволяємо доступ до сторінки логіну
      if (isLoginPage) return true;
      
      // Для адмін-маршрутів потрібен токен з роллю admin
      if (isAdminRoute) return isAdmin;
      
      return true;
    },
  },
});

export const config = {
  matcher: "/admin/:path*",
};