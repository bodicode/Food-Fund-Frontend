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
  email?: string;
  user_name: string;
  avatar_url?: string | null;
  is_active: boolean;
  role?: string;
  phone_number?: string;
}

export interface OrganizationMember {
  id: string;
  full_name: string;
  phone_number?: string;
  user_name: string;
  is_active: boolean;
}

export interface OrganizationMembership {
  id: string;
  member: OrganizationMember;
  joined_at: string;
  member_role: string;
  status: string;
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
  updated_at?: string;
  representative?: Representative | null;
  representative_id?: string;
  active_members?: number;
  total_members?: number;
  members?: OrganizationMembership[];
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
export type OrganizationRole = "DELIVERY_STAFF" | "KITCHEN_STAFF";

export interface GetMyOrganizationRequestsResponse {
  myOrganizationRequest: Organization[];
}

export interface JoinOrganizationInput {
  organization_id: string;
  requested_role: OrganizationRole;
}

export interface JoinOrganizationResponse {
  requestJoinOrganization: {
    id: string;
    message: string;
    requested_role: string;
    status: string;
    success: boolean;
  };
}

export interface JoinRequestMember {
  email: string;
  full_name: string;
  phone_number?: string;
  user_name: string;
}

export interface JoinRequest {
  id: string;
  joined_at: string;
  member: JoinRequestMember;
  member_id: string;
  member_role: string;
  status: string;
}

export interface GetOrganizationJoinRequestsResponse {
  getOrganizationJoinRequests: {
    joinRequests: JoinRequest[];
    message: string;
    success: boolean;
    total: number;
  };
}

export interface ApproveJoinRequestResponse {
  approveJoinRequest: {
    joinRequest: JoinRequest;
    message: string;
    requestId: string;
    success: boolean;
  };
}

export interface RejectJoinRequestResponse {
  rejectJoinRequest: {
    joinRequest: JoinRequest;
    message: string;
    requestId: string;
    success: boolean;
  };
}

export interface RemovedMember {
  email: string;
  id: string;
  name: string;
  role: string;
}

export interface RemoveStaffMemberResponse {
  removeStaffMember: {
    message: string;
    removedMember: RemovedMember;
  };
}
