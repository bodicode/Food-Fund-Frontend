import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
  type Operation,
  type ServerError,
  type FetchResult,
} from "@apollo/client";
import type { GraphQLError } from "graphql";
import { onError } from "@apollo/client/link/error";
import { logout, setCredentials } from "@/store/slices/auth-slice";
import { store } from "@/store";
import Cookies from "js-cookie";
import { API_URLS, COOKIE_NAMES, ROUTES } from "@/constants";
import { decodeIdToken } from "@/lib/jwt-utils";

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
// Khoảng thời gian tối thiểu giữa 2 lần refresh (để tránh loop 500 liên tục)
const REFRESH_COOLDOWN = 5000; // 5 giây

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError((errorResponse: {
  graphQLErrors?: ReadonlyArray<GraphQLError>;
  networkError?: Error | ServerError | null;
  operation: Operation;
  forward: (op: Operation) => Observable<FetchResult>
}) => {
  const { operation, forward, networkError, graphQLErrors } = errorResponse;

  // --- DEBUG LOGGING (Quan trọng để soi lỗi Prod) ---
  // Check xem có cookie RefreshToken không
  const hasRefreshToken = !!Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);

  console.log(`[ApolloError] Op: ${operation.operationName}`);
  if (graphQLErrors) {
    graphQLErrors.forEach(err => {
      console.log(`-- GQL Error: Code=[${err.extensions?.code}] Msg=[${err.message}]`);
    });
  }
  if (networkError) {
    console.log(`-- Net Error: ${networkError.message} / StatusCode: ${(networkError as ServerError).statusCode}`);
  }
  // --------------------------------------------------

  let isTokenError = false;

  // 1. Check GraphQLErrors
  if (graphQLErrors && graphQLErrors.length > 0) {
    for (const err of graphQLErrors) {
      const code = err.extensions?.code;
      const msg = (err.message || "").toLowerCase(); // convert to lower case check cho dễ

      // A. Lỗi Token rõ ràng (Dev hoặc Prod nếu backend trả đúng)
      if (
        code === "UNAUTHENTICATED" ||
        code === "FORBIDDEN" ||
        msg.includes("token expired") ||
        msg.includes("invalid cognito token")
      ) {
        console.log("-> Detected Explicit Token Error");
        isTokenError = true;
        break;
      }

      // B. Lỗi Production (Internal Server Error)
      // Chiến thuật: Nếu code là INTERNAL_ERROR, ta nghi ngờ là lỗi Token.
      // Điều kiện: Chỉ coi là lỗi Token nếu chưa vừa mới refresh xong.
      if (code === "INTERNAL_ERROR") {
        const timeSinceLastRefresh = Date.now() - lastRefreshTime;

        if (timeSinceLastRefresh > REFRESH_COOLDOWN) {
          console.log(`-> Detected INTERNAL_ERROR. Treating as Token Error (Last refresh: ${timeSinceLastRefresh}ms ago)`);
          isTokenError = true;
          break;
        } else {
          console.warn(`-> Detected INTERNAL_ERROR but ignored (Cooldown active). Maybe real server error?`);
        }
      }
    }
  }

  // 2. Check Network Error (HTTP 401 hoặc 500 ở tầng network)
  if (!isTokenError && networkError && "statusCode" in networkError) {
    const status = (networkError as ServerError).statusCode;
    if (status === 401) {
      isTokenError = true;
    }
  }

  // --- EXECUTE REFRESH ---
  if (isTokenError) {
    if (operation.operationName === "RefreshToken") {
      // Nếu chính API Refresh bị lỗi -> Logout
      store.dispatch(logout());
      window.location.replace(ROUTES.LOGIN);
      return;
    }

    // Nếu không có refresh token trong cookie thì cũng logout luôn (tránh gọi API thừa)
    if (!hasRefreshToken) {
      console.log("No refresh token cookie found. Logging out.");
      store.dispatch(logout());
      window.location.replace(ROUTES.LOGIN);
      return;
    }

    let forward$;

    if (!isRefreshing) {
      isRefreshing = true;

      forward$ = new Observable((observer) => {
        const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN);
        const idToken = Cookies.get(COOKIE_NAMES.ID_TOKEN);
        const decoded = decodeIdToken(idToken || "");
        const userName = (decoded?.["cognito:username"] as string) || (decoded?.username as string) || "";

        if (!refreshToken || !userName) {
          store.dispatch(logout());
          window.location.replace(ROUTES.LOGIN);
          observer.complete();
          return;
        }

        console.log("-> Calling Refresh Token API...");

        import("@/services/auth.service")
          .then(({ graphQLAuthService }) => graphQLAuthService.refreshToken(refreshToken, userName))
          .then((response) => {
            console.log("-> Refresh Success!");

            // Set Cookies
            Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, response.accessToken, { secure: true, sameSite: "strict", expires: 1 / 24 });
            Cookies.set(COOKIE_NAMES.ID_TOKEN, response.idToken, { secure: true, sameSite: "strict", expires: 1 / 24 });

            // Update Store
            const newDecoded = decodeIdToken(response.idToken);
            if (newDecoded) {
              store.dispatch(setCredentials({
                user: { id: newDecoded.sub!, name: newDecoded.name || "", email: newDecoded.email || "", role: newDecoded["custom:role"] },
                accessToken: response.accessToken,
                refreshToken: refreshToken
              }));
            }

            // Update timestamp & unlock
            lastRefreshTime = Date.now();
            isRefreshing = false;
            resolvePendingRequests();

            observer.next(true);
            observer.complete();
          })
          .catch((err) => {
            console.error("-> Refresh Failed:", err);
            isRefreshing = false;
            pendingRequests = [];
            store.dispatch(logout());
            window.location.replace(ROUTES.LOGIN);
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

    return new Observable((observer) => {
      let forwardSub: { unsubscribe: () => void } | undefined;
      const sub = forward$.subscribe({
        next: () => {
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