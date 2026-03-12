"use client";

import { Badge } from "@exec0/ui/badge";
import { Button } from "@exec0/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exec0/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exec0/ui/table";
import { Copy, MoreHorizontal, RotateCw, Trash2 } from "lucide-react";

interface ApiKeyRecord {
  id: string;
  keyHash: string;
  metadata: {
    name?: string;
    description?: string;
    createdAt?: string;
    lastUsedAt?: string;
    expiresAt?: string | null;
    revokedAt?: string | null;
    enabled?: boolean;
  };
}

interface KeysTableProps {
  keys: ApiKeyRecord[];
  onRevoke?: (keyId: string) => void;
  onRotate?: (keyId: string) => void;
  onCopy?: (keyHash: string) => void;
}

export function KeysTable({
  keys,
  onRevoke,
  onRotate,
  onCopy,
}: KeysTableProps) {
  const formatDate = (date: string | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isExpired = (expiresAt: string | null | undefined) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isRevoked = (revokedAt: string | null | undefined) => {
    return !!revokedAt;
  };

  return (
    <div>
      <Table className="border-separate border-spacing-y-1.5 ">
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none [&>th]:text-muted-foreground">
            <TableHead className="px-6">Key</TableHead>
            <TableHead className="px-6">Created</TableHead>
            <TableHead className="px-6">Last Used</TableHead>
            <TableHead className="px-6">Status</TableHead>
            <TableHead className="px-6 w-12.5 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow
              key={key.id}
              className="group bg-card [&>td]:first:rounded-l-sm [&>td]:last:rounded-r-sm"
            >
              <TableCell className="px-6">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {key.metadata.name || "Unnamed Key"}
                  </p>
                  {/*{key.metadata.description && (
                      <p className="text-sm text-foreground/60 line-clamp-1">
                        {key.metadata.description}
                      </p>
                    )}*/}
                </div>
              </TableCell>
              <TableCell className="px-6 text-sm text-foreground/70">
                {formatDate(key.metadata.createdAt)}
              </TableCell>
              <TableCell className="px-6 text-sm text-foreground/70">
                {formatDate(key.metadata.lastUsedAt)}
              </TableCell>
              <TableCell className="px-6">
                <Badge
                  variant={
                    isRevoked(key.metadata.revokedAt)
                      ? "destructive"
                      : isExpired(key.metadata.expiresAt)
                        ? "outline"
                        : key.metadata.enabled === false
                          ? "secondary"
                          : "default"
                  }
                >
                  {isRevoked(key.metadata.revokedAt)
                    ? "Revoked"
                    : isExpired(key.metadata.expiresAt)
                      ? "Expired"
                      : key.metadata.enabled === false
                        ? "Disabled"
                        : "Active"}
                </Badge>
              </TableCell>
              <TableCell className="px-6 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="Open menu"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onCopy?.(key.keyHash)}
                      disabled={isRevoked(key.metadata.revokedAt)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy hash
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onRotate?.(key.id)}
                      disabled={isRevoked(key.metadata.revokedAt)}
                    >
                      <RotateCw className="h-4 w-4 mr-2" />
                      Rotate
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onRevoke?.(key.id)}
                      disabled={isRevoked(key.metadata.revokedAt)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
