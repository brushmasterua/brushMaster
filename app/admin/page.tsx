// app/admin/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function AdminPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/admin/login");
  }
  
  redirect("/admin/dashboard");
}