import { jwtDecode } from "jwt-decode";

export interface DecodedIdToken {
  sub: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  exp: number;
  iat: number;
  "custom:role"?: string;
  [key: string]: unknown;
}

export function decodeIdToken(idToken?: string): DecodedIdToken | null {
  if (!idToken) {
    console.warn("decodeIdToken called with empty token");
    return null;
  }

  try {
    return jwtDecode<DecodedIdToken>(idToken);
  } catch (error) {
    console.error("Failed to decode idToken:", error);
    return null;
  }
}
