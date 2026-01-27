"use client";

import { useSaveOrgSlug } from "@/hooks/use-org-slug";

interface OrgSlugSyncProps {
  slug: string;
}

export default function OrgSlugSync({ slug }: OrgSlugSyncProps) {
  useSaveOrgSlug(slug);

  return null;
}
