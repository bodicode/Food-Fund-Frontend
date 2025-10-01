import { ServerError } from "@apollo/client";
import type { GraphQLError } from "graphql";

export interface ServerParseError extends Error {
  name: "ServerParseError";
  response: Response;
  statusCode: number;
  bodyText: string;
}

export type NormalizedError = {
  message: string;
  code?: string;
  extensions?: Record<string, unknown>;
};

interface GraphQLErrorContainer {
  graphQLErrors: GraphQLError[];
}

interface ResultErrorContainer {
  result: { errors: GraphQLError[] };
}

interface CombinedErrorContainer {
  error: GraphQLError;
}

interface NetworkErrorContainer {
  networkError: ServerError | ServerParseError;
}

export function normalizeApolloError(error: unknown): NormalizedError[] {
  const normalized: NormalizedError[] = [];

  console.log("Normalizing error:", error);

  // Case 1: Apollo classic graphQLErrors
  if (typeof error === "object" && error !== null && "graphQLErrors" in error) {
    const gqlErrors = (error as GraphQLErrorContainer).graphQLErrors;
    console.log("gqlErrors:", gqlErrors);
    if (Array.isArray(gqlErrors)) {
      normalized.push(
        ...gqlErrors.map((e) => ({
          message: e.message,
          code: e.extensions?.code as string | undefined,
          extensions: e.extensions as Record<string, unknown> | undefined,
        }))
      );
    }
  }

  // Case 2: Apollo wrap error.result.errors
  if (typeof error === "object" && error !== null && "result" in error) {
    const resultErrors = (error as ResultErrorContainer).result?.errors;
    console.log("resultErrors:", resultErrors);
    if (Array.isArray(resultErrors)) {
      normalized.push(
        ...resultErrors.map((e) => ({
          message: e.message,
          code: e.extensions?.code as string | undefined,
          extensions: e.extensions as Record<string, unknown> | undefined,
        }))
      );
    }
  }

  // Case 3: CombinedGraphQLErrors
  if (typeof error === "object" && error !== null && "error" in error) {
    const inner = (error as CombinedErrorContainer).error;
    if (inner?.message) {
      normalized.push({
        message: inner.message,
        code: inner.extensions?.code as string | undefined,
        extensions: inner.extensions as Record<string, unknown> | undefined,
      });
    }
  }

  // Case 4: NetworkError fallback
  if (typeof error === "object" && error !== null && "networkError" in error) {
    const netErr = (error as NetworkErrorContainer).networkError;
    if (netErr) {
      normalized.push({
        message: netErr.message || "Network error",
      });
    }
  }

  // Case 5: errors array trực tiếp trong object (CombinedGraphQLErrors)
  if (typeof error === "object" && error !== null && "errors" in error) {
    const errs = (error as { errors?: GraphQLError[] }).errors;
    if (Array.isArray(errs)) {
      normalized.push(
        ...errs.map((e: GraphQLError) => ({
          message: e.message,
          code: e.extensions?.code as string | undefined,
          extensions: e.extensions as Record<string, unknown> | undefined,
        }))
      );
    }
  }


  return normalized;
}
