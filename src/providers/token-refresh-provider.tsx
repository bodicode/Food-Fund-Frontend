"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIE_NAMES, TOKEN_REFRESH_CONFIG } from "@/constants";
import { decodeIdToken } from "@/lib/jwt-utils";
import { store } from "@/store";
import { setCredentials } from "@/store/slices/auth-slice";

// Refresh token trước khi access token hết hạn
// Mặc định: 5 phút (300000 ms)
// Có thể thay đổi bằng environment variable: NEXT_PUBLIC_TOKEN_REFRESH_BEFORE_EXPIRY_MS
const REFRESH_BEFORE_EXPIRY_MS = TOKEN_REFRESH_CONFIG.REFRESH_BEFORE_EXPIRY_MS;

interface DecodedAccessToken {
    exp: number;
    iat: number;
    [key: string]: unknown;
}

/**
 * Tính toán thời gian còn lại trước khi token hết hạn (tính bằng milliseconds)
 * Trả về null nếu không thể decode token hoặc token đã hết hạn
 */
function getTimeUntilExpiry(accessToken: string | undefined): number | null {
    if (!accessToken) return null;

    try {
        const decoded = jwtDecode<DecodedAccessToken>(accessToken);
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        // Nếu token đã hết hạn hoặc sắp hết hạn (còn ít hơn 1 phút), trả về null
        if (timeUntilExpiry < 60 * 1000) {
            return null;
        }

        return timeUntilExpiry;
    } catch (error) {
        console.error("Failed to decode access token:", error);
        return null;
    }
}

/**
 * Tính toán thời gian cần đợi trước khi refresh token
 * Refresh trước 5 phút khi token hết hạn
 */
function calculateRefreshDelay(accessToken: string | undefined): number | null {
    const timeUntilExpiry = getTimeUntilExpiry(accessToken);
    if (timeUntilExpiry === null) {
        return null;
    }

    // Nếu còn ít hơn 5 phút, refresh ngay lập tức
    if (timeUntilExpiry <= REFRESH_BEFORE_EXPIRY_MS) {
        return 0;
    }

    // Refresh trước 5 phút
    return timeUntilExpiry - REFRESH_BEFORE_EXPIRY_MS;
}

export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const scheduleRefresh = () => {
            // Clear timeout cũ nếu có
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }

            const accessToken = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
            const refreshDelay = calculateRefreshDelay(accessToken);

            if (refreshDelay === null) {
                return;
            }

            timeoutRef.current = setTimeout(() => {
                refreshAuthToken();
            }, refreshDelay);
        };

        const refreshAuthToken = async () => {
            const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
            const idToken = Cookies.get(COOKIE_NAMES.ID_TOKEN);

            if (!refreshToken || !idToken) {
                return;
            }

            try {
                // Decode idToken to get userName
                const decoded = decodeIdToken(idToken);
                const userName = (decoded?.["cognito:username"] as string) || (decoded?.username as string) || "";

                if (!userName) {
                    return;
                }

                // Import dynamically to avoid circular dependency
                const { graphQLAuthService } = await import("@/services/auth.service");

                // Call refresh token with skipAuth: true context (handled in service/client)
                const response = await graphQLAuthService.refreshToken(refreshToken, userName);

                // Update tokens in cookies
                Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, response.accessToken, {
                    secure: true,
                    sameSite: "strict",
                    expires: 1 / 24, // 1 hour
                });
                Cookies.set(COOKIE_NAMES.ID_TOKEN, response.idToken, {
                    secure: true,
                    sameSite: "strict",
                    expires: 1 / 24, // 1 hour
                });

                // Update Redux store
                const newDecoded = decodeIdToken(response.idToken);
                if (newDecoded) {
                    store.dispatch(
                        setCredentials({
                            user: {
                                id: newDecoded.sub!,
                                name: newDecoded.name || "",
                                email: newDecoded.email || "",
                                role: newDecoded["custom:role"],
                            },
                            accessToken: response.accessToken,
                            refreshToken: refreshToken, // Keep existing refresh token
                        })
                    );
                }

                // Lên lịch refresh tiếp theo cho token mới
                scheduleRefresh();
            } catch (error) {
                console.error("[TokenRefresh] Proactive token refresh failed:", error);
                // Don't logout here to avoid disrupting user if it's just a network glitch
                // The main errorLink will handle actual failures during requests
                
                // Thử lại sau 1 phút nếu refresh thất bại
                timeoutRef.current = setTimeout(() => {
                    scheduleRefresh();
                }, 60 * 1000);
            }
        };

        // Lên lịch refresh ban đầu
        scheduleRefresh();

        // Cleanup khi component unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    return <>{children}</>;
}
