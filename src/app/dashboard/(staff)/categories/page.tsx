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
  searchParams: Promise<{ error?: string; category?: string; type?: string }>;
}) {
  const session = await requirePermission(PERMISSIONS.equipmentRead);
  const params = await searchParams;
  const categories = await listCategories(true);
  const canWrite = hasPermission(session.permissions, PERMISSIONS.equipmentWrite);

  return (
    <>
      <MasterHero kicker="Catalogue" title="Categories" icon={FolderTree} />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-slate-500">
        Add equipment, then the capacities and boom lengths that belong to each one.
      </p>
      <Flash error={params.error} />
      <CategoryBoard
        canWrite={canWrite}
        initialCategory={params.category}
        initialType={params.type}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          parentId: category.parentId,
          kind: category.kind,
          imagePath: category.imagePath,
          archivedAt: category.archivedAt,
        }))}
      />
    </>
  );
}
