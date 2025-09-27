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

const authLink = new ApolloLink((operation, forward) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

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
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      store.dispatch(logout());
      window.location.replace("/login");
    } else {
      toast.error(err.message || "Có lỗi xảy ra khi gọi API");
    }
  });
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:8000/graphql",
});

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export default client;
