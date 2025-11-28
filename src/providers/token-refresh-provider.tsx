"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { COOKIE_NAMES } from "@/constants";
import { decodeIdToken } from "@/lib/jwt-utils";
import { store } from "@/store";
import { setCredentials } from "@/store/slices/auth-slice";

const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes

export function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const refreshAuthToken = async () => {
            const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
            const idToken = Cookies.get(COOKIE_NAMES.ID_TOKEN);

            if (!refreshToken || !idToken) return;

            try {
                // Decode idToken to get userName
                const decoded = decodeIdToken(idToken);
                const userName = (decoded?.["cognito:username"] as string) || (decoded?.username as string) || "";

                if (!userName) return;

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
                    console.log("Token refreshed proactively");
                }
            } catch (error) {
                console.error("Proactive token refresh failed:", error);
                // Don't logout here to avoid disrupting user if it's just a network glitch
                // The main errorLink will handle actual failures during requests
            }
        };

        // Initial check (optional, or just rely on interval)
        // refreshAuthToken();

        const intervalId = setInterval(refreshAuthToken, REFRESH_INTERVAL);

        return () => clearInterval(intervalId);
    }, []);

    return <>{children}</>;
}
