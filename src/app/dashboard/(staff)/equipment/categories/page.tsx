import { redirect } from "next/navigation";

export default async function LegacyCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.error) query.set("error", params.error);
  const search = query.toString();
  redirect(search ? `/dashboard/categories?${search}` : "/dashboard/categories");
}
