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

// --- STATE QUẢN LÝ REFRESH ---
let isRefreshing = false;
let pendingRequests: Array<() => void> = [];
// Biến này giúp chặn vòng lặp vô tận nếu server thực sự bị lỗi 500 liên tục
let lastRefreshTime = 0;

const resolvePendingRequests = () => {
  pendingRequests.map((callback) => callback());
  pendingRequests = [];
};

const errorLink = onError((errorResponse: {
  graphQLErrors?: ReadonlyArray<GraphQLError>;
  networkError?: Error | ServerError | ServerParseError | null;
  operation: Operation;
  forward: (op: Operation) => Observable<FetchResult>
}) => {
  const { operation, forward, networkError, graphQLErrors } = errorResponse;
  const errors = normalizeApolloError(errorResponse);

  // Log để debug (Bạn có thể comment lại khi production ổn định)
  console.log("[ApolloError] Error caught:", JSON.stringify({
    operationName: operation.operationName,
    graphQLErrors,
    networkError,
    // Chỉ log xem có cookie không, không log giá trị để bảo mật
    cookies: {
      hasAccess: !!Cookies.get(COOKIE_NAMES.ACCESS_TOKEN),
      hasRefresh: !!Cookies.get(COOKIE_NAMES.REFRESH_TOKEN),
    }
  }, null, 2));

  // --- CHECK LOGIC: Xác định xem có phải lỗi token không ---
  let isTokenError = false;

  // 1. Check lỗi GraphQL
  if (graphQLErrors && graphQLErrors.length > 0) {
    for (const err of graphQLErrors) {
      const code = err.extensions?.code;
      const msg = err.message || "";

      // A. Các trường hợp lỗi Token rõ ràng (thường gặp ở Dev hoặc nếu BE trả code chuẩn)
      if (
        code === "UNAUTHENTICATED" ||
        code === "FORBIDDEN" ||
        msg.includes("Invalid Cognito token") ||
        msg.includes("Token expired")
      ) {
        isTokenError = true;
        break;
      }

      // B. Trường hợp Production: Backend giấu lỗi -> trả về "Internal server error" + code "INTERNAL_ERROR"
      // Logic: Nếu gặp lỗi 500 chung chung VÀ chưa vừa mới refresh xong (cách 3s) thì thử refresh 1 lần.
      if (
        code === "INTERNAL_ERROR" &&
        msg === "Internal server error"
      ) {
        const TIME_THRESHOLD = 3000; // 3 giây cooldown
        const now = Date.now();

        if (now - lastRefreshTime > TIME_THRESHOLD) {
          console.warn("[ApolloError] Generic Internal Error detected (Production), attempting refresh token...");
          isTokenError = true;
          break;
        } else {
          console.warn("[ApolloError] Generic Internal Error detected but ignored (Refresh cooldown active).");
        }
      }
    }
  }

  // Fallback: Check network error (HTTP 401)
  if (!isTokenError && networkError && "statusCode" in networkError) {
    if ((networkError as ServerError | ServerParseError).statusCode === 401) {
      isTokenError = true;
    }
  }

  // --- XỬ LÝ REFRESH ---
  if (isTokenError) {
    // Nếu chính API RefreshToken bị lỗi thì thôi, logout luôn
    if (operation.operationName === "RefreshToken") {
      pendingRequests = [];
      isRefreshing = false;
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
          console.warn("[ApolloError] Missing tokens for refresh");
          store.dispatch(logout());
          window.location.replace(ROUTES.LOGIN);
          observer.complete();
          return;
        }

        const decoded = decodeIdToken(idToken);
        const userName = (decoded?.["cognito:username"] as string) || (decoded?.username as string) || "";

        if (!userName) {
          store.dispatch(logout());
          window.location.replace(ROUTES.LOGIN);
          observer.complete();
          return;
        }

        import("@/services/auth.service")
          .then(({ graphQLAuthService }) =>
            graphQLAuthService.refreshToken(refreshToken, userName)
          )
          .then((response) => {
            // Update cookies
            Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, response.accessToken, {
              secure: true,
              sameSite: "strict",
              expires: 1 / 24,
            });
            Cookies.set(COOKIE_NAMES.ID_TOKEN, response.idToken, {
              secure: true,
              sameSite: "strict",
              expires: 1 / 24,
            });

            // Update Redux
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

            // --- QUAN TRỌNG: Cập nhật thời gian refresh thành công ---
            lastRefreshTime = Date.now();
            // -------------------------------------------------------

            resolvePendingRequests();
            isRefreshing = false;

            observer.next(true);
            observer.complete();
          })
          .catch((refreshError) => {
            console.error("Token refresh failed:", refreshError);
            pendingRequests = [];
            isRefreshing = false;

            store.dispatch(logout());

            if (!sessionStorage.getItem('refresh_failed')) {
              toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
              sessionStorage.setItem('refresh_failed', 'true');
            }

            window.location.replace(ROUTES.LOGIN);
            observer.error(refreshError);
          });
      });
    } else {
      // Nếu đang refresh thì cho vào hàng chờ
      forward$ = new Observable((observer) => {
        pendingRequests.push(() => {
          observer.next(true);
          observer.complete();
        });
      });
    }

    // Retry request gốc sau khi refresh xong
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

  // Log lỗi thông thường không phải token
  errors.forEach((err) => {
    // Chỉ log error message nếu không phải là lỗi Internal Server Error (vì lỗi này đã được xử lý logic ở trên rồi)
    if (err.message !== "Internal server error") {
      console.error(err.message || "Có lỗi xảy ra khi gọi API");
    }
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