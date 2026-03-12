"use client";

import { Input } from "@exec0/ui/input";
import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface TeamsSearchProps {
  teams: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  onSearch: (
    filtered: Array<{ id: string; name: string; slug: string }>,
  ) => void;
}

export default function TeamsSearch({ teams, onSearch }: TeamsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) {
      return teams;
    }

    const term = searchTerm.toLowerCase();
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(term) ||
        team.slug.toLowerCase().includes(term),
    );
  }, [teams, searchTerm]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      onSearch(filtered);
    },
    [filtered, onSearch],
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder="Search teams by name or slug..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-9 h-9"
      />
    </div>
  );
}
