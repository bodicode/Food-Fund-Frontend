/**
 * Convert title to URL-friendly slug
 * Example: "Bữa ăn cho em" -> "bua-an-cho-em"
 */
export function titleToSlug(title: string): string {
  // Normalize Vietnamese characters
  const normalized = title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Remove diacritics

  return normalized
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Extract ID from slug (slug format: "title-id")
 * Example: "bua-an-cho-em-123abc" -> "123abc"
 */
export function extractIdFromSlug(slug: string): string {
  // Try to find a UUID at the end of the string
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slug.match(uuidRegex);

  if (match) {
    return match[0];
  }

  // Fallback for non-UUID IDs (if any) or existing logic
  const parts = slug.split("-");
  return parts[parts.length - 1];
}

/**
 * Create campaign URL slug with title only
 * Example: createCampaignSlug("Bữa ăn cho em", "123abc") -> "bua-an-cho-em"
 * ID is stored in sessionStorage
 */
export function createCampaignSlug(title: string, id: string): string {
  const titleSlug = titleToSlug(title);

  // Store ID in sessionStorage for later retrieval (optimization for local nav)
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`campaign_${titleSlug}`, id);
  }

  return titleSlug;
}

/**
 * Get campaign ID from slug
 * First tries sessionStorage, then extracts from slug string
 */
export function getCampaignIdFromSlug(slug: string): string | null {
  if (!slug) return null;

  // 1. Check sessionStorage (fastest)
  if (typeof window !== "undefined") {
    const storedId = sessionStorage.getItem(`campaign_${slug}`);
    if (storedId) return storedId;
  }

  // 2. Extract from slug string (for direct links/new tabs)
  // format: title-slug-id
  return extractIdFromSlug(slug);
}


export function createOrganizationSlug(name: string, id: string): string {
  const nameSlug = titleToSlug(name);

  // Store ID in sessionStorage for later retrieval
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`org_${nameSlug}`, id);
  }

  return nameSlug;
}

export function getOrganizationIdFromSlug(slug: string): string | null {
  if (!slug) return null;

  // 1. Check sessionStorage
  if (typeof window !== "undefined") {
    const storedId = sessionStorage.getItem(`org_${slug}`);
    if (storedId) return storedId;
  }

  // 2. Extract from slug string (fallback)
  return extractIdFromSlug(slug);
}
