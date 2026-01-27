import TeamsCreate from "@/modules/teams/teams-create";
import TeamsList from "@/modules/teams/teams-list";

export default async function TeamsPage() {
  return (
    <div>
      <TeamsList />
      <TeamsCreate />
    </div>
  );
}
