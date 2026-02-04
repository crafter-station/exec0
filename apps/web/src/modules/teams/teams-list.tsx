"use client";

import { Button } from "@exec0/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@exec0/ui/dialog";
import { IconPlusFillDuo18 } from "nucleo-ui-essential-fill-duo-18";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import CreateTeamModal from "./create-team-modal";
import TeamCard from "./team-card";
import TeamsEmptyState from "./teams-empty-state";
import TeamsSearch from "./teams-search";

interface TeamsListProps {
  teams: Array<{
    id: string;
    name: string;
    slug: string;
    createdAt: string | Date;
    logo?: string;
  }>;
}

type FilteredTeam = {
  id: string;
  name: string;
  slug: string;
};

export default function TeamsList({ teams }: TeamsListProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filteredTeams, setFilteredTeams] = useState(teams);
  const [deleteDialog, setDeleteDialog] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleSearch = useCallback(
    (filtered: FilteredTeam[]) => {
      // Map back to full team objects
      const fullFiltered = filtered
        .map((f) => teams.find((t) => t.id === f.id))
        .filter((t) => t !== undefined) as typeof teams;
      setFilteredTeams(fullFiltered);
    },
    [teams],
  );

  const handleDeleteTeam = (id: string, name: string) => {
    setDeleteDialog({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteDialog) return;

    try {
      // TODO: Implement delete organization API call
      toast.error("Delete functionality coming soon");
      setDeleteDialog(null);
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  if (teams.length === 0) {
    return (
      <>
        <TeamsEmptyState onCreateClick={() => setIsCreateModalOpen(true)} />
        <CreateTeamModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header with Title and Create Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Teams</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and organize your teams
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
            size="sm"
          >
            <IconPlusFillDuo18 className="size-4" />
            Create team
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-xs">
          <TeamsSearch teams={teams} onSearch={handleSearch} />
        </div>

        {/* Teams Grid */}
        {filteredTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                id={team.id}
                name={team.name}
                slug={team.slug}
                createdAt={
                  typeof team.createdAt === "string"
                    ? new Date(team.createdAt)
                    : team.createdAt
                }
                memberCount={0} // TODO: Fetch member count from API
                status="active"
                logo={team.logo}
                onDelete={handleDeleteTeam}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-sm font-medium text-foreground mb-1">
                No teams found
              </h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateTeamModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteDialog}
        onOpenChange={(open) => !open && setDeleteDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteDialog?.name}</strong>? This action cannot be
              undone. All team data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
