"use client";

import { useEffect, useState } from "react";

/** Storage key for the organization slug in localStorage */
const ORG_SLUG_KEY = "currentOrgSlug";

/** Return type for useOrgSlug hook */
interface UseOrgSlugReturn {
  /** The stored organization slug or null if not found */
  slug: string | null;
  /** Boolean indicating if localStorage has been read */
  isLoaded: boolean;
}

/**
 * Hook to retrieve the stored organization slug from localStorage.
 *
 * Reads the slug value on component mount and provides a loading state
 * to indicate when the data has been fetched from localStorage.
 *
 * @example
 * const { slug, isLoaded } = useOrgSlug();
 * if (!isLoaded) return <Spinner />;
 * return <div>{slug}</div>;
 */
export function useOrgSlug(): UseOrgSlugReturn {
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Retrieve the slug from localStorage on mount
    const storedSlug = localStorage.getItem(ORG_SLUG_KEY);
    setSlug(storedSlug);
    // Mark as loaded after reading from storage
    setIsLoaded(true);
  }, []);

  return { slug, isLoaded };
}

/**
 * Hook to automatically save the organization slug to localStorage.
 *
 * Watches the provided slug and updates localStorage whenever it changes.
 * Only saves if the slug value is truthy (not null, undefined, or empty string).
 *
 * @param slug - The organization slug to save
 *
 * @example
 * const { currentOrg } = useOrganization();
 * useSaveOrgSlug(currentOrg.slug);
 */
export function useSaveOrgSlug(slug: string): void {
  useEffect(() => {
    if (slug) {
      // Update localStorage whenever slug changes
      localStorage.setItem(ORG_SLUG_KEY, slug);
    }
  }, [slug]);
}

/**
 * Synchronously retrieve the cached organization slug from localStorage.
 *
 * Safe for use during server-side rendering - returns null if window is undefined.
 * Use this in event handlers or non-hook contexts where useOrgSlug() cannot be used.
 *
 * @example
 * const handleNavigate = () => {
 *   const slug = getCachedOrgSlug();
 *   if (slug) navigate(`/${slug}`);
 * };
 */
export function getCachedOrgSlug(): string | null {
  // Guard against server-side rendering
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ORG_SLUG_KEY);
}

/**
 * Clear the cached organization slug from localStorage.
 *
 * Safe for use during server-side rendering - does nothing if window is undefined.
 * Useful for logout flows or when clearing organization context.
 *
 * @example
 * const handleLogout = () => {
 *   clearOrgSlug();
 *   redirect("/login");
 * };
 */
export function clearOrgSlug(): void {
  // Guard against server-side rendering
  if (typeof window === "undefined") return;
  localStorage.removeItem(ORG_SLUG_KEY);
}
