import { APPROVE_ORGANIZATION_REQUEST } from "../graphql/mutations/organization/approved-organization-request copy";
import { REJECT_ORGANIZATION_REQUEST } from "../graphql/mutations/organization/rejected-organization-request";
import { CREATE_ORGANIZATION } from "../graphql/mutations/organization/request-create-organization";
import { REQUEST_JOIN_ORGANIZATION } from "../graphql/mutations/organization/request-join-organization";
import { APPROVE_JOIN_REQUEST } from "../graphql/mutations/organization/approve-join-request";
import { REJECT_JOIN_REQUEST } from "../graphql/mutations/organization/reject-join-request";
import { REMOVE_STAFF_MEMBER } from "../graphql/mutations/organization/remove-staff-member";
import { GET_ALL_ORGANIZATION_REQUESTS } from "../graphql/query/organization/get-all-organization-request";
import { GET_MY_ORGANIZATION_REQUESTS } from "../graphql/query/organization/get-my-organization-request";
import { GET_MY_ORGANIZATION } from "../graphql/query/organization/get-my-organization";
import { LIST_ACTIVE_ORGANIZATIONS } from "../graphql/query/organization/list-active-organizations";
import { GET_ORGANIZATION_JOIN_REQUESTS } from "../graphql/query/organization/get-organization-join-requests";
import { GET_ORGANIZATION_BY_ID } from "../graphql/query/organization/get-organization-by-id";
import client from "../lib/apollo-client";
import {
  ApproveJoinRequestResponse,
  ApproveOrganizationRequestResponse,
  CreateOrganizationInput,
  CreateOrganizationResponse,
  GetAllOrganizationRequestsResponse,
  GetMyOrganizationRequestsResponse,
  GetOrganizationJoinRequestsResponse,
  JoinOrganizationInput,
  JoinOrganizationResponse,
  JoinRequest,
  Organization,
  RejectJoinRequestResponse,
  RejectOrganizationRequestResponse,
  RemoveStaffMemberResponse,
  RemovedMember,
  GetEligibleOrganizationsResponse,
  EligibleOrganization,
  ReassignmentRequest,
  GetPendingReassignmentRequestsResponse,
  RespondReassignmentInput,
  RespondReassignmentResponse,
  JoinRequestStatus,
} from "../types/api/organization";
import { GET_ELIGIBLE_ORGS } from "../graphql/query/organization/get-eligible-orgs";
import { GET_PENDING_REASSIGNMENT_REQUESTS } from "../graphql/query/organization/get-pending-reassignment-requests";
import { RESPOND_TO_REASSIGNMENT } from "../graphql/mutations/organization/respond-to-reassignment";
import { MY_JOIN_REQUEST } from "../graphql/query/organization/my-join-request";
import { CANCEL_JOIN_REQUEST_ORGANIZATION } from "../graphql/mutations/organization/cancel-join-request";
import {
  MyJoinRequest,
  MyJoinRequestResponse,
  CancelJoinRequestResponse,
} from "../types/api/organization";
import { CANCEL_MY_CREATE_ORGANIZATION_REQUEST } from "../graphql/mutations/organization/cancel-create-request";

export interface CancelMyCreateOrganizationRequestResponse {
  cancelMyCreateOrganizationRequest: {
    cancelledOrganizationId: string;
    message: string;
    previousStatus: string;
    reason: string;
    success: boolean;
  };
}
import { LEAVE_ORGANIZATION } from "../graphql/mutations/organization/leave-organization";

export interface LeaveOrganizationResponse {
  leaveOrganization: {
    message: string;
    previousOrganization: {
      id: string;
      name: string;
    };
    requiresReLogin: boolean;
    previousRole: string;
    success: boolean;
  };
}

export const organizationService = {
  async leaveOrganization(): Promise<LeaveOrganizationResponse["leaveOrganization"]> {
    const { data } = await client.mutate<LeaveOrganizationResponse>({
      mutation: LEAVE_ORGANIZATION,
    });

    if (!data?.leaveOrganization) {
      throw new Error("No data returned from mutation");
    }

    return data.leaveOrganization;
  },
  async cancelMyCreateOrganizationRequest(): Promise<
    CancelMyCreateOrganizationRequestResponse["cancelMyCreateOrganizationRequest"]
  > {
    const { data } = await client.mutate<CancelMyCreateOrganizationRequestResponse>({
      mutation: CANCEL_MY_CREATE_ORGANIZATION_REQUEST,
    });

    if (!data?.cancelMyCreateOrganizationRequest) {
      throw new Error("No data returned from mutation");
    }

    return data.cancelMyCreateOrganizationRequest;
  },
  async createOrganization(
    input: CreateOrganizationInput
  ): Promise<CreateOrganizationResponse> {
    const { data } = await client.mutate<{
      requestCreateOrganization: CreateOrganizationResponse;
    }>({
      mutation: CREATE_ORGANIZATION,
      variables: { input },
    });

    if (!data) {
      throw new Error("No data returned from mutation");
    }

    return data.requestCreateOrganization;
  },

  async getAllOrganizationRequests(
    sortOrder: "asc" | "desc" = "asc"
  ): Promise<Organization[]> {
    const { data } = await client.query<GetAllOrganizationRequestsResponse>({
      query: GET_ALL_ORGANIZATION_REQUESTS,
      variables: { sortOrder },
      fetchPolicy: "network-only",
    });

    if (!data) {
      throw new Error("No data returned from query");
    }

    return data.getAllOrganizationRequests;
  },

  async approveOrganizationRequest(
    organizationId: string
  ): Promise<Organization> {
    const { data } = await client.mutate<ApproveOrganizationRequestResponse>({
      mutation: APPROVE_ORGANIZATION_REQUEST,
      variables: { organizationId },
    });
    if (!data) throw new Error("No data returned from mutation");
    return data.approveOrganizationRequest.organization;
  },

  async rejectOrganizationRequest(
    organizationId: string
  ): Promise<Organization> {
    const { data } = await client.mutate<RejectOrganizationRequestResponse>({
      mutation: REJECT_ORGANIZATION_REQUEST,
      variables: { organizationId },
    });
    if (!data) throw new Error("No data returned from mutation");
    return data.rejectOrganizationRequest.organization;
  },

  async getMyOrganizationRequests(): Promise<Organization[]> {
    const { data } = await client.query<GetMyOrganizationRequestsResponse>({
      query: GET_MY_ORGANIZATION_REQUESTS,
      fetchPolicy: "network-only",
    });

    if (!data) {
      throw new Error("No data returned from query");
    }

    return data.myOrganizationRequest;
  },

  async getMyOrganization(): Promise<Organization | null> {
    const { data } = await client.query<{ myOrganization: Organization }>({
      query: GET_MY_ORGANIZATION,
      fetchPolicy: "network-only",
    });

    return data?.myOrganization ?? null;
  },

  async getActiveOrganizations(): Promise<{
    organizations: Organization[];
    total: number;
    hasMore: boolean;
  }> {
    const { data } = await client.query<{
      listActiveOrganizations: {
        organizations: Organization[];
        total: number;
        hasMore: boolean;
        success: boolean;
        message: string;
      };
    }>({
      query: LIST_ACTIVE_ORGANIZATIONS,
      fetchPolicy: "network-only",
    });

    if (!data?.listActiveOrganizations) {
      return { organizations: [], total: 0, hasMore: false };
    }

    return {
      organizations: data.listActiveOrganizations.organizations,
      total: data.listActiveOrganizations.total,
      hasMore: data.listActiveOrganizations.hasMore,
    };
  },

  async requestJoinOrganization(
    input: JoinOrganizationInput
  ): Promise<JoinOrganizationResponse["requestJoinOrganization"]> {
    const { data } = await client.mutate<JoinOrganizationResponse>({
      mutation: REQUEST_JOIN_ORGANIZATION,
      variables: { requestJoinOrganizationInput2: input },
    });

    if (!data?.requestJoinOrganization) {
      throw new Error("No data returned from mutation");
    }

    return data.requestJoinOrganization;
  },

  async getOrganizationJoinRequests(
    limit: number = 10,
    offset: number = 0,
    status?: JoinRequestStatus
  ): Promise<{
    joinRequests: JoinRequest[];
    total: number;
  }> {
    const { data } = await client.query<GetOrganizationJoinRequestsResponse>({
      query: GET_ORGANIZATION_JOIN_REQUESTS,
      variables: { limit, offset, status },
      fetchPolicy: "network-only",
    });

    if (!data?.getOrganizationJoinRequests) {
      return { joinRequests: [], total: 0 };
    }

    return {
      joinRequests: data.getOrganizationJoinRequests.joinRequests,
      total: data.getOrganizationJoinRequests.total,
    };
  },

  async approveJoinRequest(requestId: string): Promise<JoinRequest> {
    const { data } = await client.mutate<ApproveJoinRequestResponse>({
      mutation: APPROVE_JOIN_REQUEST,
      variables: { requestId },
    });

    if (!data?.approveJoinRequest) {
      throw new Error("No data returned from mutation");
    }

    return data.approveJoinRequest.joinRequest;
  },

  async rejectJoinRequest(requestId: string): Promise<JoinRequest> {
    const { data } = await client.mutate<RejectJoinRequestResponse>({
      mutation: REJECT_JOIN_REQUEST,
      variables: { requestId },
    });

    if (!data?.rejectJoinRequest) {
      throw new Error("No data returned from mutation");
    }

    return data.rejectJoinRequest.joinRequest;
  },

  async removeStaffMember(memberId: string): Promise<RemovedMember> {
    const { data } = await client.mutate<RemoveStaffMemberResponse>({
      mutation: REMOVE_STAFF_MEMBER,
      variables: { memberId },
    });

    if (!data?.removeStaffMember) {
      throw new Error("No data returned from mutation");
    }

    return data.removeStaffMember.removedMember;
  },

  async getOrganizationById(id: string): Promise<Organization> {
    const { data } = await client.query<{
      getOrganizationById: Organization;
    }>({
      query: GET_ORGANIZATION_BY_ID,
      variables: { getOrganizationByIdId: id },
      fetchPolicy: "network-only",
    });

    if (!data?.getOrganizationById) {
      throw new Error("Organization not found");
    }

    return data.getOrganizationById;
  },

  async getEligibleOrganizations(campaignId: string): Promise<{
    organizations: EligibleOrganization[];
    total: number;
  }> {
    const { data } = await client.query<GetEligibleOrganizationsResponse>({
      query: GET_ELIGIBLE_ORGS,
      variables: { campaignId },
      fetchPolicy: "network-only",
    });

    if (!data?.getEligibleOrganizationsForReassignment) {
      return { organizations: [], total: 0 };
    }

    return {
      organizations: data.getEligibleOrganizationsForReassignment.organizations,
      total: data.getEligibleOrganizationsForReassignment.total,
    };
  },
  async getPendingReassignmentRequests(): Promise<ReassignmentRequest[]> {
    const { data } = await client.query<GetPendingReassignmentRequestsResponse>({
      query: GET_PENDING_REASSIGNMENT_REQUESTS,
      fetchPolicy: "network-only",
    });

    return data?.getPendingReassignmentRequests || [];
  },

  async respondToReassignment(
    input: RespondReassignmentInput
  ): Promise<RespondReassignmentResponse["respondToReassignment"]> {
    const { data } = await client.mutate<RespondReassignmentResponse>({
      mutation: RESPOND_TO_REASSIGNMENT,
      variables: { input },
    });

    if (!data?.respondToReassignment) {
      throw new Error("No data returned from mutation");
    }

    return data.respondToReassignment;
  },

  async myJoinRequest(): Promise<MyJoinRequest[]> {
    const { data } = await client.query<MyJoinRequestResponse>({
      query: MY_JOIN_REQUEST,
      fetchPolicy: "network-only",
    });

    return data?.myJoinRequest || [];
  },

  async cancelJoinRequestOrganization(): Promise<CancelJoinRequestResponse["cancelJoinRequestOrganization"]> {
    const { data } = await client.mutate<CancelJoinRequestResponse>({
      mutation: CANCEL_JOIN_REQUEST_ORGANIZATION,
    });

    if (!data?.cancelJoinRequestOrganization) {
      throw new Error("No data returned from mutation");
    }

    return data.cancelJoinRequestOrganization;
  },
};
