// app/test/page.tsx
import { prisma } from "@/lib/prisma";

export default async function TestPage() {
  const categories = await prisma.category.findMany();
  
  return (
    <pre>
      {JSON.stringify(categories, null, 2)}
    </pre>
  );
}