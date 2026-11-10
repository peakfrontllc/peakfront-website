import type { Metadata } from "next";
import { FolderTree } from "lucide-react";
import { CategoryBoard } from "@/components/manage/erp/CategoryBoard";
import { Flash, MasterHero } from "@/components/manage/erp/ui";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { listCategories } from "@/lib/erp/equipment";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Categories", robots: { index: false, follow: false } };

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; category?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const params = await searchParams;
  const categories = await listCategories(true);
  const canWrite = hasPermission(session.permissions, PERMISSIONS.equipmentWrite);

  return (
    <>
      <MasterHero kicker="Catalogue" title="Categories" icon={FolderTree} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Add, edit, and remove main categories, then the equipment and sizes that belong to them.
      </p>
      <Flash error={params.error} />
      <CategoryBoard
        canWrite={canWrite}
        initialCategory={params.category}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          parentId: category.parentId,
          archivedAt: category.archivedAt,
        }))}
      />
    </>
  );
}
