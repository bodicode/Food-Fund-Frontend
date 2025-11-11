import {
  MESSAGE_PATTERNS,
  SUCCESS_MESSAGES,
  STATUS_CONFIG,
  STATUS_ACTIONS,
  ROLE_TRANSLATIONS,
  ERROR_MESSAGES,
  VALIDATION_MESSAGES
} from "@/constants";

export const translateMessage = (msg: string) => {
  // Register
  if (msg.includes(MESSAGE_PATTERNS.USER_REGISTERED)) {
    return SUCCESS_MESSAGES.USER_REGISTERED;
  }
  if (msg.includes(MESSAGE_PATTERNS.EMAIL_CONFIRMED)) {
    return SUCCESS_MESSAGES.EMAIL_CONFIRMED;
  }
  if (msg.includes(MESSAGE_PATTERNS.CONFIRMATION_CODE_SENT)) {
    return SUCCESS_MESSAGES.CONFIRMATION_CODE_SENT;
  }
  if (msg.includes(MESSAGE_PATTERNS.PASSWORD_RESET_CODE_SENT)) {
    return SUCCESS_MESSAGES.PASSWORD_RESET_CODE_SENT;
  }
  // Forgot password
  if (msg.includes(MESSAGE_PATTERNS.PASSWORD_RESET_CODE_SENT)) {
    return SUCCESS_MESSAGES.PASSWORD_RESET_CODE_SENT;
  }
  if (msg.includes(MESSAGE_PATTERNS.PASSWORD_RESET_SUCCESS)) {
    return SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS;
  }
  // Signout
  if (msg.includes(MESSAGE_PATTERNS.USER_SIGNED_OUT)) {
    return SUCCESS_MESSAGES.USER_SIGNED_OUT;
  }
  // Request Create Organization
  if (msg.includes(MESSAGE_PATTERNS.ORGANIZATION_REQUEST)) {
    return SUCCESS_MESSAGES.ORGANIZATION_REQUEST_SUBMITTED;
  }

  if (msg.includes(MESSAGE_PATTERNS.JOIN_REQUEST)) {
    return SUCCESS_MESSAGES.JOIN_REQUEST_SUBMITTED;
  }

  return msg;
};

// Define error type interface
interface GraphQLError {
  message?: string;
  extensions?: {
    code?: string;
    details?: Array<{ message?: string }>;
    context?: {
      cognitoError?: string;
    };
  };
}

interface ErrorWithGraphQL {
  errors?: GraphQLError[];
  result?: {
    errors?: GraphQLError[];
  };
  graphQLErrors?: GraphQLError[];
}

export const translateError = (err: unknown): string => {
  try {
    const errorObj = err as ErrorWithGraphQL;

    const gqlError =
      errorObj?.errors?.[0] ||
      errorObj?.result?.errors?.[0] ||
      errorObj?.graphQLErrors?.[0];

    const cognitoError =
      (gqlError?.extensions?.details?.[0]?.message?.trim()
        ? gqlError.extensions.details[0].message
        : null) ??
      gqlError?.extensions?.context?.cognitoError ??
      "";

    // Login
    if (cognitoError.includes("Incorrect username or password")) {
      return ERROR_MESSAGES.INCORRECT_CREDENTIALS;
    }
    if (cognitoError.includes("User is not confirmed"))
      return ERROR_MESSAGES.USER_NOT_CONFIRMED;
    if (cognitoError.includes("Password attempts exceeded"))
      return ERROR_MESSAGES.PASSWORD_ATTEMPTS_EXCEEDED;
    if (cognitoError.includes("Subgraph auth circuit is open"))
      return ERROR_MESSAGES.AUTH_CIRCUIT_OPEN;
    // Signup
    if (cognitoError.includes("User already exists"))
      return ERROR_MESSAGES.USER_ALREADY_EXISTS;
    if (cognitoError.includes("phone number"))
      return ERROR_MESSAGES.INVALID_PHONE_NUMBER;
    if (cognitoError.includes("InvalidPasswordException"))
      return ERROR_MESSAGES.INVALID_PASSWORD;

    // Confirm register
    if (cognitoError.includes("Invalid verification code provided"))
      return ERROR_MESSAGES.INVALID_VERIFICATION_CODE;
    if (cognitoError.includes("ExpiredCodeException"))
      return ERROR_MESSAGES.EXPIRED_CODE;
    if (cognitoError.includes("Confirmation code must be 6 digits"))
      return ERROR_MESSAGES.CONFIRMATION_CODE_FORMAT;

    // Confirm forgot password
    if (
      cognitoError.includes(
        "Invalid code provided, please request a code again"
      )
    )
      return ERROR_MESSAGES.INVALID_CODE_REQUEST_AGAIN;

    // Validation error
    if (gqlError?.extensions?.code === "VALIDATION_ERROR") {
      const details = gqlError?.extensions?.details;
      if (Array.isArray(details) && details.length > 0) {
        return details[0]?.message || VALIDATION_MESSAGES.INVALID_INPUT;
      }
      return VALIDATION_MESSAGES.INVALID_INPUT;
    }

    return (
      cognitoError ||
      gqlError?.message ||
      VALIDATION_MESSAGES.GENERAL_ERROR
    );
  } catch (e) {
    console.error("translateError failed:", e, err);
    return VALIDATION_MESSAGES.GENERAL_ERROR;
  }
};

export const translateRole = (role?: string): string => {
  if (!role) return "Người dùng";

  const upperRole = role.toUpperCase() as keyof typeof ROLE_TRANSLATIONS;
  return ROLE_TRANSLATIONS[upperRole] || role;
};

// Re-export constants for backward compatibility
export const statusConfig = STATUS_CONFIG;
export const statusActions = STATUS_ACTIONS;

// Re-export status utilities
export {
  translateCampaignStatus,
  translatePaymentStatus,
  translateTransactionStatus,
  translateRequestStatus,
  translateOrganizationStatus,
  translateUserStatus,
  translateStatus,
  getStatusColorClass,
} from "@/lib/utils/status-utils";
