import { APPROVE_ORGANIZATION_REQUEST } from "@/graphql/mutations/organization/approved-organization-request copy";
import { REJECT_ORGANIZATION_REQUEST } from "@/graphql/mutations/organization/rejected-organization-request";
import { CREATE_ORGANIZATION } from "@/graphql/mutations/organization/request-create-organization";
import { GET_ALL_ORGANIZATION_REQUESTS } from "@/graphql/query/organization/get-all-organization-request";
import client from "@/lib/apollo-client";
import {
  ApproveOrganizationRequestResponse,
  CreateOrganizationInput,
  CreateOrganizationResponse,
  GetAllOrganizationRequestsResponse,
  Organization,
  RejectOrganizationRequestResponse,
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
};
