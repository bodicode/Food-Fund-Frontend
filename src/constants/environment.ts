// API and CDN URLs
export const API_URLS = {
  GRAPHQL: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:8000/graphql",
  CDN_BASE: process.env.NEXT_PUBLIC_CDN_BASE_URL ?? "https://foodfund.sgp1.cdn.digitaloceanspaces.com",
} as const;

// Authentication
export const AUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
} as const;

// Redux Persist
export const PERSIST_CONFIG = {
  KEY: "root",
  WHITELIST: ["auth", "campaignForm"] as string[],
};

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  ID_TOKEN: "idToken",
  ROLE: "role",
} as const;