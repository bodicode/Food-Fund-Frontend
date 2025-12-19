export interface CreateOperationRequestInput {
  campaignPhaseId: string;
  expenseType: "COOKING" | "DELIVERY";
  title: string;
  totalCost: string;
}

export interface OperationRequestFilterInput {
  campaignPhaseId?: string | null;
  campaignId?: string | null;
  status?: string | null;
  expenseType?: "COOKING" | "DELIVERY" | null;
  limit?: number;
  offset?: number;
}

export type OperationRequestSortOrder = "NEWEST_FIRST" | "OLDEST_FIRST";

export interface OperationRequest {
  id: string;
  title: string;
  totalCost: string;
  expenseType: "COOKING" | "DELIVERY";
  status: string;
  created_at: string;
  adminNote?: string | null;
  changedStatusAt?: string | null;
  user: {
    id: string;
    full_name: string;
  };
  campaignPhase?: {
    id: string;
    phaseName: string;
    campaign?: {
      id: string;
      title: string;
    };
  } | null;
  organization?: {
    id: string;
    name: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    bank_short_name: string;
  };
}

export interface UpdateOperationRequestStatusInput {
  requestId: string;
  status: "APPROVED" | "REJECTED";
  adminNote?: string;
}

export interface UpdateOperationRequestStatusResponse {
  updateOperationRequestStatus: {
    id: string;
    status: string;
    adminNote?: string | null;
    changedStatusAt?: string | null;
  };
}

export interface OperationRequestStats {
  totalRequests: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface OperationRequestStatsResponse {
  operationRequestStats: OperationRequestStats;
}

export interface OperationRequestsResponse {
  operationRequests: OperationRequest[];
}

export interface OperationRequestResponse {
  operationRequest: OperationRequest;
}

export interface CreateOperationRequestResponse {
  createOperationRequest: OperationRequest;
}
