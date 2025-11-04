import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { toast } from "sonner";
import { normalizeApolloError } from "@/lib/apollo-error";
import { logout } from "@/store/slices/auth-slice";
import { store } from "@/store";
import Cookies from "js-cookie";
import { API_URLS, COOKIE_NAMES, ERROR_MESSAGES, ROUTES } from "@/constants";

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN);

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    }));
  }

  return forward(operation);
});

const errorLink = onError((error) => {
  const errors = normalizeApolloError(error);

  errors.forEach((err) => {
    if (
      err.message.includes("Invalid Cognito token") ||
      err.code === "UNAUTHENTICATED"
    ) {
      toast.error(ERROR_MESSAGES.SESSION_EXPIRED);
      store.dispatch(logout());
      window.location.replace(ROUTES.LOGIN);
    } else {
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
