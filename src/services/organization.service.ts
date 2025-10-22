import { APPROVE_ORGANIZATION_REQUEST } from "@/graphql/mutations/organization/approved-organization-request copy";
import { REJECT_ORGANIZATION_REQUEST } from "@/graphql/mutations/organization/rejected-organization-request";
import { CREATE_ORGANIZATION } from "@/graphql/mutations/organization/request-create-organization";
import { REQUEST_JOIN_ORGANIZATION } from "@/graphql/mutations/organization/request-join-organization";
import { APPROVE_JOIN_REQUEST } from "@/graphql/mutations/organization/approve-join-request";
import { REJECT_JOIN_REQUEST } from "@/graphql/mutations/organization/reject-join-request";
import { REMOVE_STAFF_MEMBER } from "@/graphql/mutations/organization/remove-staff-member";
import { GET_ALL_ORGANIZATION_REQUESTS } from "@/graphql/query/organization/get-all-organization-request";
import { GET_MY_ORGANIZATION_REQUESTS } from "@/graphql/query/organization/get-my-organization-request";
import { GET_MY_ORGANIZATION } from "@/graphql/query/organization/get-my-organization";
import { LIST_ACTIVE_ORGANIZATIONS } from "@/graphql/query/organization/list-active-organizations";
import { GET_ORGANIZATION_JOIN_REQUESTS } from "@/graphql/query/organization/get-organization-join-requests";
import client from "@/lib/apollo-client";
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
} from "@/types/api/organization";

export const organizationService = {
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

  async getOrganizationJoinRequests(): Promise<{
    joinRequests: JoinRequest[];
    total: number;
  }> {
    const { data } = await client.query<GetOrganizationJoinRequestsResponse>({
      query: GET_ORGANIZATION_JOIN_REQUESTS,
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
};
