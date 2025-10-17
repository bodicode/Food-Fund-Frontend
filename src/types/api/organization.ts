export interface CreateOrganizationInput {
  activity_field: string;
  address: string;
  description: string;
  email: string;
  name: string;
  phone_number: string;
  representative_identity_number: string;
  representative_name: string;
  website: string;
}

export interface Representative {
  id: string;
  full_name: string;
  email: string;
  user_name: string;
  avatar_url: string | null;
  is_active: boolean;
  role: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  website: string;
  status: string;
  description: string;
  created_at: string;
  representative: Representative;
}

export interface CreateOrganizationResponse {
  message: string;
  success: boolean;
  organization: Organization;
}

export interface GetAllOrganizationRequestsResponse {
  getAllOrganizationRequests: Organization[];
}

export interface ApproveOrganizationRequestResponse {
  approveOrganizationRequest: {
    success: boolean;
    message: string;
    organization: Organization;
  };
}

export interface RejectOrganizationRequestResponse {
  rejectOrganizationRequest: {
    success: boolean;
    message: string;
    organization: Organization;
  };
}

export type OrganizationStatus = "PENDING" | "APPROVED" | "REJECTED" | "ALL";
