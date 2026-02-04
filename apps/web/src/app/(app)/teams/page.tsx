import { auth } from "@exec0/auth";
import { headers } from "next/headers";
import TeamsList from "@/modules/teams/teams-list";

export default async function TeamsPage() {
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

  return (
    <div className="px-6 py-8">
      <TeamsList teams={teams} />
    </div>
  );
}
