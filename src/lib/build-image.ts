export function buildCoverUrl(key?: string | null): string {
    if (!key) return "";

    // Nếu đã là URL đầy đủ (https://...) → return luôn
    if (/^https?:\/\//i.test(key)) return key;

    // Build URL từ CDN base
    const cdnBase =
        process.env.NEXT_PUBLIC_CDN_BASE_URL ||
        "https://foodfund.sgp1.cdn.digitaloceanspaces.com";

    // Ghép: base + / + key (loại bỏ dấu / thừa)
    return `${cdnBase.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}