"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@exec0/auth";
import { headers } from "next/headers";
import keys from "@/lib/keys";

const createApiKeySchema = z.object({
  slug: z.string().min(1, "Organization slug is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  scopes: z.array(z.string()).default(["read"]),
  expiresAt: z.string().optional(),
});

export async function createApiKey(prevState: any, formData: FormData) {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  });

  const input = {
    slug: formData.get("api-key-slug") as string,
    name: formData.get("api-key-name") as string,
    description: formData.get("api-key-description") as string,
    expiresAt: (formData.get("api-key-expires-at") as string) || undefined,
    scopes: (formData.get("api-key-scopes") as string)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || ["read"],
  };

  const validation = createApiKeySchema.safeParse(input);

  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const { slug, name, description, expiresAt, scopes } = validation.data;

  const organization = organizations.find((org) => org.slug === slug);
  if (!organization) {
    return { success: false, error: "Organization not found" };
  }

  const { key } = await keys.create(
    {
      ownerId: slug,
      name,
      description,
      scopes,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    },
    {
      userId: session.user.id,
      ip: requestHeaders.get("x-forwarded-for") || "unknown",
      metadata: { organizationSlug: slug },
    },
  );

  revalidatePath(`/${slug}/keys`);

  return {
    success: true,
    data: key,
  };
}

export async function listApiKeys(organizationSlug: string) {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  });

  const organization = organizations.find(
    (org) => org.slug === organizationSlug,
  );
  if (!organization) {
    return { success: false, error: "Organization not found" };
  }

  const keysList = await keys.list(organizationSlug);

  return {
    success: true,
    data: keysList.map((record) => ({
      id: record.id,
      name: record.metadata.name,
      description: record.metadata.description,
      scopes: record.metadata.scopes || [],
      createdAt: record.metadata.createdAt,
      lastUsedAt: record.metadata.lastUsedAt,
      expiresAt: record.metadata.expiresAt,
      enabled: record.metadata.enabled !== false,
      revokedAt: record.metadata.revokedAt,
    })),
  };
}

export async function revokeApiKey(keyId: string, slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  await keys.revoke(keyId, {
    userId: session.user.id,
    metadata: { via: "web" },
  });

  revalidatePath(`/${slug}/keys`);

  return { success: true };
}

export async function enableApiKey(keyId: string, slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  await keys.enable(keyId);

  revalidatePath(`/${slug}/keys`);

  return { success: true };
}

export async function disableApiKey(keyId: string, slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  await keys.disable(keyId);

  revalidatePath(`/${slug}/keys`);

  return { success: true };
}

export async function rotateApiKey(
  keyId: string,
  slug: string,
  updates?: { name?: string; scopes?: string[] },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const { key } = await keys.rotate(keyId, updates);

  revalidatePath(`/${slug}/keys`);

  return {
    success: true,
    data: key,
  };
}
