import { API_URLS } from "@/constants";

export function buildCoverUrl(key?: string | null): string {
    if (!key) return "";

    // Nếu đã là URL đầy đủ (https://...) → return luôn
    if (/^https?:\/\//i.test(key)) return key;

    // Build URL từ CDN base
    const cdnBase = API_URLS.CDN_BASE;

    // Ghép: base + / + key (loại bỏ dấu / thừa)
    return `${cdnBase.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}