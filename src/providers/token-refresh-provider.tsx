"use client";

import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { COOKIE_NAMES, TOKEN_REFRESH_CONFIG } from "../constants";
import { decodeIdToken } from "../lib/jwt-utils";
import { store } from "../store";
import { setCredentials } from "../store/slices/auth-slice";

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
 * Trả về null nếu không thể decode token
 * Trả về số âm nếu token đã hết hạn
 */
function getTimeUntilExpiry(accessToken: string | undefined): number | null {
    if (!accessToken) return null;

    try {
        const decoded = jwtDecode<DecodedAccessToken>(accessToken);
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        return timeUntilExpiry; // Có thể là số âm nếu đã hết hạn
    } catch (error) {
        console.error("Failed to decode access token:", error);
        return null;
    }
}

/**
 * Tính toán thời gian cần đợi trước khi refresh token
 * Refresh trước 5 phút khi token hết hạn
 * Nếu token đã hết hạn hoặc sắp hết hạn, refresh ngay lập tức
 */
function calculateRefreshDelay(accessToken: string | undefined): number | null {
    const timeUntilExpiry = getTimeUntilExpiry(accessToken);
    if (timeUntilExpiry === null) {
        return null;
    }

    // Nếu token đã hết hạn hoặc còn ít hơn 5 phút, refresh ngay lập tức
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
                // Nếu không tính được delay (token không hợp lệ), thử refresh ngay
                // để tránh bị logout
                refreshAuthToken();
                return;
            }

            // Nếu delay = 0, refresh ngay lập tức
            if (refreshDelay === 0) {
                refreshAuthToken();
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
                const { graphQLAuthService } = await import("../services/auth.service");

                // Call refresh token with skipAuth: true context (handled in service/client)
                const response = await graphQLAuthService.refreshToken(refreshToken, userName);

                // Update Redux store and Cookies (setCredentials handles cookies with correct expiration)
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
                            idToken: response.idToken,
                            expiresIn: response.expiresIn,
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
