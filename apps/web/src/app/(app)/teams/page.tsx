import { auth } from "@exec0/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import TeamsList from "@/modules/teams/teams-list";
import { TeamsSkeleton } from "@/modules/teams/teams-skeleton";

export default function TeamsPage() {
  return (
    <div className="px-6 py-8">
      <Suspense fallback={<TeamsSkeleton />}>
        <TeamsContent />
      </Suspense>
    </div>
  );
}

async function TeamsContent() {
  const data = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const teams = (data || []).map((org) => ({
    id: org.id,
    name: org.name,
    slug: org.slug,
    createdAt: org.createdAt,
    logo: org.logo || undefined,
  }));

  return <TeamsList teams={teams} />;
}
