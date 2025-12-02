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
  // Store ID in sessionStorage for later retrieval
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`campaign_${titleSlug}`, id);
  }
  return titleSlug;
}

/**
 * Get campaign ID from slug
 * First tries sessionStorage, then returns slug as fallback (for search)
 */
export function getCampaignIdFromSlug(slug: string): string | null {
  if (!slug) return null;

  // 1. Check sessionStorage (fastest, most accurate for local navigation)
  if (typeof window !== "undefined") {
    const storedId = sessionStorage.getItem(`campaign_${slug}`);
    if (storedId) return storedId;
  }

  // 2. If not in session, return the slug itself.
  // The caller (page.tsx) will decide whether to treat this as an ID or search by slug.
  return slug;
}
