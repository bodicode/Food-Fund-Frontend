// ==============================
// EXPENSE PROOF TYPES
// ==============================

export type ExpenseProofStatus = "PENDING" | "APPROVED" | "REJECTED";


export interface ExpenseProofItem {
  ingredientName: string;
  quantity: number;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  supplier: string;
}

export interface ExpenseProofRequest {
  id: string;
  items: ExpenseProofItem[];
  campaignPhase: {
    id: string;
    phaseName: string;
    location: string;
    campaign: {
      id: string;
      title: string;
    };
  };
}

export interface ExpenseProof {
  id: string;
  requestId: string;
  request?: ExpenseProofRequest;
  media: string[];
  amount: number;
  status: ExpenseProofStatus;
  adminNote?: string | null;
  created_at: string;
  changedStatusAt?: string | null;
  updated_at?: string | null;
}

export interface ExpenseProofFilterInput {
  campaignId: string;
  status?: ExpenseProofStatus | null;
}

export interface GetExpenseProofsParams {
  filter: ExpenseProofFilterInput;
  limit?: number;
  offset?: number;
}

export interface GetExpenseProofsResponse {
  getExpenseProofs: ExpenseProof[];
}

export interface GetExpenseProofsWithTotalResponse {
  getExpenseProofs: {
    items: ExpenseProof[];
    total: number;
  };
}

export interface GetExpenseProofResponse {
  getExpenseProof: ExpenseProof;
}

export interface ExpenseProofStats {
  totalProofs: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface GetExpenseProofStatsResponse {
  getExpenseProofStats: ExpenseProofStats;
}

export interface UpdateExpenseProofStatusInput {
  status: ExpenseProofStatus;
  adminNote?: string;
}

export interface UpdateExpenseProofStatusResponse {
  updateExpenseProofStatus: {
    id: string;
    status: ExpenseProofStatus;
    adminNote?: string;
    changedStatusAt: string;
  };
}
