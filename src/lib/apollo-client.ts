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
import { toast } from "sonner";
import { normalizeApolloError, type ServerParseError } from "@/lib/apollo-error";
import { logout, setCredentials } from "@/store/slices/auth-slice";
import { store } from "@/store";
import Cookies from "js-cookie";
import { API_URLS, COOKIE_NAMES, ERROR_MESSAGES, ROUTES } from "@/constants";
import { decodeIdToken } from "@/lib/jwt-utils";

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);

    operation.setContext(({ headers = {}, skipAuth }: { headers?: Record<string, string>; skipAuth?: boolean }) => {
      // Don't send Authorization header for RefreshToken mutation or if skipAuth is true
      if (skipAuth || operation.operationName === "RefreshToken") {
        // Explicitly remove Authorization header if it exists
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Authorization, ...restHeaders } = headers;
        return {
          headers: {
            ...restHeaders,
          },
        };
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

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError((errorResponse: { graphQLErrors?: ReadonlyArray<GraphQLError>; networkError?: Error | ServerError | ServerParseError | null; operation: Operation; forward: (op: Operation) => Observable<FetchResult> }) => {
  const { operation, forward, networkError, graphQLErrors } = errorResponse;
  const errors = normalizeApolloError(errorResponse);

  // --- CHECK LOGIC: Xác định xem có phải lỗi token không ---
  let isTokenError = false;

  // 1. Check lỗi GraphQL (message cụ thể)
  // Check directly in graphQLErrors first for most accurate detection
  if (graphQLErrors && graphQLErrors.length > 0) {
    for (const err of graphQLErrors) {
      if (
        err.message.includes("Invalid Cognito token") ||
        err.message.includes("Token expired") ||
        (err.extensions?.code === "INTERNAL_ERROR" && err.message.includes("Invalid Cognito token")) ||
        err.extensions?.code === "UNAUTHENTICATED"
      ) {
        isTokenError = true;
        break;
      }
    }
  }

  // Fallback to normalized errors if not found yet
  if (!isTokenError && errors.length > 0) {
    for (const err of errors) {
      // Check if token is expired or invalid
      if (
        err.message.includes("Invalid Cognito token") ||
        err.message.includes("Token expired") ||
        err.code === "UNAUTHENTICATED"
      ) {
        isTokenError = true;
        break;
      }
    }
  }

  // 2. Check lỗi Network (HTTP 401)
  if (!isTokenError && networkError && "statusCode" in networkError) {
    if ((networkError as ServerError | ServerParseError).statusCode === 401) {
      isTokenError = true;
    }
  }

  if (isTokenError) {
    // Don't retry if already refreshing or if this is the refresh mutation itself
    if (operation.operationName === "RefreshToken") {
      toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
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

        if (!refreshToken || !idToken) {
          toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
          store.dispatch(logout());
          window.location.replace(ROUTES.LOGIN);
          observer.complete();
          return;
        }

        // Decode idToken to get userName
        const decoded = decodeIdToken(idToken);
        const userName = (decoded?.["cognito:username"] as string) || (decoded?.username as string) || "";

        if (!userName) {
          console.error("No username found in token");
          toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
          store.dispatch(logout());
          window.location.replace(ROUTES.LOGIN);
          observer.complete();
          return;
        }

        // Import dynamically to avoid circular dependency
        import("@/services/auth.service")
          .then(({ graphQLAuthService }) =>
            graphQLAuthService.refreshToken(refreshToken, userName)
          )
          .then((response) => {
            // Update tokens in cookies with expiration
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

            // Decode and update Redux store
            const decoded = decodeIdToken(response.idToken);
            if (decoded) {
              store.dispatch(
                setCredentials({
                  user: {
                    id: decoded.sub!,
                    name: decoded.name || "",
                    email: decoded.email || "",
                    role: decoded["custom:role"],
                  },
                  accessToken: response.accessToken,
                  refreshToken: Cookies.get(COOKIE_NAMES.REFRESH_TOKEN) || "",
                })
              );
            }

            // Resolve pending requests
            resolvePendingRequests();
            isRefreshing = false;

            observer.next(true);
            observer.complete();
          })
          .catch((refreshError) => {
            console.error("Token refresh failed:", refreshError);
            pendingRequests = [];
            isRefreshing = false;

            // Clear auth state but don't force redirect
            store.dispatch(logout());

            // Only show toast once
            if (!sessionStorage.getItem('refresh_failed')) {
              toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.");
              sessionStorage.setItem('refresh_failed', 'true');
            }

            observer.error(refreshError);
          });
      });
    } else {
      // Wait for the current refresh to complete
      forward$ = new Observable((observer) => {
        pendingRequests.push(() => {
          observer.next(true);
          observer.complete();
        });
      });
    }

    // Replace flatMap with manual chaining since Apollo Observable doesn't support flatMap
    return new Observable((observer) => {
      let forwardSub: { unsubscribe: () => void } | undefined;
      const subscription = forward$.subscribe({
        next: () => {
          forwardSub = forward(operation).subscribe(observer);
        },
        error: observer.error.bind(observer),
      });

      return () => {
        subscription.unsubscribe();
        if (forwardSub) forwardSub.unsubscribe();
      };
    });
  }

  // Log other errors
  errors.forEach((err) => {
    console.error(err.message || "Có lỗi xảy ra khi gọi API");
  });
});

const httpLink = new HttpLink({
  uri: API_URLS.GRAPHQL,
});

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export default client;