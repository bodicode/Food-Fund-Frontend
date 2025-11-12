import client from "@/lib/apollo-client";
import { CREATE_OPERATION_REQUEST } from "@/graphql/mutations/operation-request/create-operation-request";
import { UPDATE_OPERATION_REQUEST_STATUS } from "@/graphql/mutations/operation-request/update-operation-request-status";
import { GET_OPERATION_REQUESTS } from "@/graphql/query/operation-request/get-operation-requests";
import { GET_OPERATION_REQUEST } from "@/graphql/query/operation-request/get-operation-request";
import { GET_OPERATION_REQUEST_STATS } from "@/graphql/query/operation-request/get-operation-request-stats";
import {
  CreateOperationRequestInput,
  CreateOperationRequestResponse,
  OperationRequest,
  OperationRequestFilterInput,
  OperationRequestResponse,
  OperationRequestsResponse,
  OperationRequestStats,
  OperationRequestStatsResponse,
  UpdateOperationRequestStatusInput,
  UpdateOperationRequestStatusResponse,
} from "@/types/api/operation-request";

class OperationRequestService {
  async createOperationRequest(
    input: CreateOperationRequestInput
  ): Promise<OperationRequest | null> {
    try {
      const { data } = await client.mutate<CreateOperationRequestResponse>({
        mutation: CREATE_OPERATION_REQUEST,
        variables: { input },
      });

      return data?.createOperationRequest || null;
    } catch (error) {
      console.error("Error creating operation request:", error);
      throw error;
    }
  }

  async getOperationRequests(
    filter: OperationRequestFilterInput
  ): Promise<OperationRequest[]> {
    try {
      const { data } = await client.query<OperationRequestsResponse>({
        query: GET_OPERATION_REQUESTS,
        variables: { filter },
        fetchPolicy: "no-cache",
      });

      return data?.operationRequests || [];
    } catch (error) {
      console.error("Error fetching operation requests:", error);
      return [];
    }
  }

  async getOperationRequestById(id: string): Promise<OperationRequest | null> {
    try {
      const { data } = await client.query<OperationRequestResponse>({
        query: GET_OPERATION_REQUEST,
        variables: { id },
        fetchPolicy: "no-cache",
      });

      return data?.operationRequest || null;
    } catch (error) {
      console.error("Error fetching operation request:", error);
      return null;
    }
  }

  async updateOperationRequestStatus(
    input: UpdateOperationRequestStatusInput
  ): Promise<boolean> {
    try {
      const { data } = await client.mutate<UpdateOperationRequestStatusResponse>({
        mutation: UPDATE_OPERATION_REQUEST_STATUS,
        variables: { input },
      });

      return !!data?.updateOperationRequestStatus;
    } catch (error) {
      console.error("Error updating operation request status:", error);
      throw error;
    }
  }

  async getOperationRequestStats(): Promise<OperationRequestStats | null> {
    try {
      const { data } = await client.query<OperationRequestStatsResponse>({
        query: GET_OPERATION_REQUEST_STATS,
        fetchPolicy: "no-cache",
      });

      return data?.operationRequestStats || null;
    } catch (error) {
      console.error("Error fetching operation request stats:", error);
      return null;
    }
  }
}

export const operationRequestService = new OperationRequestService();
