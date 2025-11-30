import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { logout, setCredentials } from "@/store/slices/auth-slice";
import { store } from "@/store";
import Cookies from "js-cookie";
import { API_URLS, COOKIE_NAMES, ROUTES } from "@/constants";
import { decodeIdToken } from "@/lib/jwt-utils";
import { normalizeApolloError } from "@/lib/apollo-error";

// --- AUTH LINK ---
const authLink = new ApolloLink((operation, forward) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);

    operation.setContext(({ headers = {}, skipAuth }: { headers?: Record<string, string>; skipAuth?: boolean }) => {
      if (skipAuth || operation.operationName === "RefreshToken") {
        const { ...restHeaders } = headers;
        return { headers: { ...restHeaders } };
      }
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
  }
  return forward(operation);
});

// --- VARIABLES FOR REFRESH LOGIC ---
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

// Lưu timestamp của lần refresh thành công cuối cùng
let lastRefreshTime = 0;
// Khoảng thời gian tối thiểu giữa 2 lần refresh (để tránh loop 500 liên tục nếu server sập thật)
const REFRESH_COOLDOWN = 2000; // 2 giây

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError((errorResponse) => {
  const { operation, forward } = errorResponse;

  // --- DEBUG LOGGING ---
  let hasRefreshToken = false;
  if (typeof window !== "undefined") {
    hasRefreshToken = !!Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
  } else {
    // Nếu là Server Side thì không xử lý refresh token ở đây
    return forward(operation);
  }

  // Use normalizeApolloError to extract errors from any structure (graphQLErrors, networkError, result, etc.)
  const normalizedErrors = normalizeApolloError(errorResponse);

  console.log(`[ApolloError] Op: ${operation.operationName}`);
  console.log(`[ApolloError] Normalized Errors:`, normalizedErrors);

  // Logic kiểm tra lỗi
  let isTokenError = false;

  const checkError = (code: string | undefined, message: string) => {
    const msg = (message || "").toLowerCase();

    // 1. CASE DEVELOPMENT & STANDARD (Lỗi rõ ràng)
    if (
      code === "UNAUTHENTICATED" ||
      code === "FORBIDDEN" ||
      msg.includes("token expired") ||
      msg.includes("invalid cognito token") ||
      msg.includes("user not found")
    ) {
      console.log("-> [ApolloError] Detected Explicit Token Error (Dev/Standard)");
      return true;
    }

    // 2. CASE PRODUCTION (Lỗi bị ẩn thành 500)
    // Backend trả về: message "Internal server error" và code "INTERNAL_ERROR"
    // Payload example: { message: "Internal server error", extensions: { code: "INTERNAL_ERROR", serviceName: "campaign" } }
    if (code === "INTERNAL_ERROR" && msg === "internal server error") {
      const timeSinceLastRefresh = Date.now() - lastRefreshTime;

      // Chỉ coi là lỗi token nếu chúng ta chưa vừa mới refresh xong (Cooldown)
      if (timeSinceLastRefresh > REFRESH_COOLDOWN) {
        console.log(`-> [ApolloError] Detected Generic INTERNAL_ERROR (Prod). Attempting Refresh.`);
        return true;
      } else {
        console.warn(`-> [ApolloError] Ignored INTERNAL_ERROR (Cooldown active). Likely a real server crash.`);
        return false;
      }
    }

    return false;
  };

  // Check all normalized errors
  for (const err of normalizedErrors) {
    if (checkError(err.code, err.message)) {
      isTokenError = true;
      break;
    }
  }

  // --- EXECUTE REFRESH ---
  if (isTokenError) {
    console.log(`-> Refresh Logic Triggered. Op: ${operation.operationName}, RefreshTokenCookie: ${hasRefreshToken}`);

    // Nếu chính API Refresh bị lỗi -> Logout ngay lập tức (tránh loop)
    if (operation.operationName === "RefreshToken") {
      store.dispatch(logout());
      if (typeof window !== "undefined") window.location.replace(ROUTES.LOGIN);
      return;
    }

    // Không có cookie refresh -> Logout
    if (!hasRefreshToken) {
      console.log("No refresh token cookie found. Logging out.");
      store.dispatch(logout());
      if (typeof window !== "undefined") window.location.replace(ROUTES.LOGIN);
      return;
    }

    let forward$;

    if (!isRefreshing) {
      isRefreshing = true;

      forward$ = new Observable((observer) => {
        const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
        const idToken = Cookies.get(COOKIE_NAMES.ID_TOKEN);

        // Decode an toàn, tránh lỗi null
        const decoded = idToken ? decodeIdToken(idToken) : null;
        const userName = (decoded?.["cognito:username"] as string) || (decoded?.username as string) || "";

        if (!refreshToken || !userName) {
          store.dispatch(logout());
          if (typeof window !== "undefined") window.location.replace(ROUTES.LOGIN);
          observer.complete();
          return;
        }

        console.log("-> [Auth] Refreshing Token...");

        import("@/services/auth.service")
          .then(({ graphQLAuthService }) => graphQLAuthService.refreshToken(refreshToken, userName))
          .then((response) => {
            console.log("-> [Auth] Refresh Success!");

            // 1. Cập nhật Cookies
            Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, response.accessToken, { secure: true, sameSite: "strict", expires: 1 / 24 });
            Cookies.set(COOKIE_NAMES.ID_TOKEN, response.idToken, { secure: true, sameSite: "strict", expires: 1 / 24 });

            // 2. Cập nhật Redux Store
            const newDecoded = decodeIdToken(response.idToken);
            if (newDecoded) {
              store.dispatch(setCredentials({
                user: { id: newDecoded.sub!, name: newDecoded.name || "", email: newDecoded.email || "", role: newDecoded["custom:role"] },
                accessToken: response.accessToken,
                refreshToken: refreshToken
              }));
            }

            // 3. Reset trạng thái & Update Timestamp
            lastRefreshTime = Date.now(); // Cập nhật thời gian refresh thành công
            isRefreshing = false;
            resolvePendingRequests();

            observer.next(true);
            observer.complete();
          })
          .catch((err) => {
            console.error("-> [Auth] Refresh Failed:", err);
            isRefreshing = false;
            pendingRequests = [];
            store.dispatch(logout());
            if (typeof window !== "undefined") window.location.replace(ROUTES.LOGIN);
            observer.error(err);
          });
      });
    } else {
      console.log("-> Queuing request...");
      forward$ = new Observable((observer) => {
        pendingRequests.push(() => {
          observer.next(true);
          observer.complete();
        });
      });
    }

    // Retry request gốc
    return new Observable((observer) => {
      let forwardSub: { unsubscribe: () => void } | undefined;
      const sub = forward$.subscribe({
        next: () => {
          // Cập nhật token mới vào header của request cũ trước khi retry
          const newToken = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              Authorization: newToken ? `Bearer ${newToken}` : "",
            },
          });

          forwardSub = forward(operation).subscribe(observer);
        },
        error: observer.error.bind(observer),
      });
      return () => {
        sub.unsubscribe();
        if (forwardSub) forwardSub.unsubscribe();
      };
    });
  }
});

const httpLink = new HttpLink({ uri: API_URLS.GRAPHQL });

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network", errorPolicy: "all" },
    query: { fetchPolicy: "cache-first", errorPolicy: "all" },
    mutate: { errorPolicy: "all" },
  },
});

export default client;