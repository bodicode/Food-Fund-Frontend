import { GET_SYSTEM_CONFIGS, GET_SYSTEM_CONFIG } from "@/graphql/query/system-config";
import { UPDATE_SYSTEM_CONFIG, DELETE_SYSTEM_CONFIG } from "@/graphql/mutations/system-config";
import client from "@/lib/apollo-client";
import {
    GetSystemConfigsResponse,
    GetSystemConfigResponse,
    SystemConfig,
    UpdateSystemConfigResponse,
    DeleteSystemConfigResponse,
    UpdateSystemConfigInput
} from "@/types/api/system-config";

export const systemConfigService = {
    async getSystemConfigs(): Promise<SystemConfig[]> {
        try {
            const { data } = await client.query<GetSystemConfigsResponse>({
                query: GET_SYSTEM_CONFIGS,
                fetchPolicy: "network-only",
            });

            return data?.getSystemConfigs || [];
        } catch (error) {
            console.error("Error fetching system configs:", error);
            throw error;
        }
    },

    async getSystemConfig(key: string): Promise<SystemConfig | null> {
        try {
            const { data } = await client.query<GetSystemConfigResponse>({
                query: GET_SYSTEM_CONFIG,
                variables: { key },
                fetchPolicy: "network-only",
            });

            return data?.getSystemConfig || null;
        } catch (error) {
            console.error(`Error fetching system config for key ${key}:`, error);
            return null;
        }
    },

    async updateSystemConfig(input: UpdateSystemConfigInput): Promise<SystemConfig> {
        try {
            const { data } = await client.mutate<UpdateSystemConfigResponse>({
                mutation: UPDATE_SYSTEM_CONFIG,
                variables: { input },
            });
            if (!data) throw new Error("No data returned from update");
            return data.updateSystemConfig;
        } catch (error) {
            console.error("Error updating system config:", error);
            throw error;
        }
    },

    async deleteSystemConfig(key: string): Promise<boolean> {
        try {
            const { data } = await client.mutate<DeleteSystemConfigResponse>({
                mutation: DELETE_SYSTEM_CONFIG,
                variables: { key },
            });
            if (!data) throw new Error("No data returned from delete");
            return data.deleteSystemConfig.success;
        } catch (error) {
            console.error("Error deleting system config:", error);
            throw error;
        }
    },
};
