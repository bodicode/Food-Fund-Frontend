export interface SystemConfig {
    key: string;
    value: string;
    description: string;
    dataType: string;
    updatedAt: string;
}

export interface GetSystemConfigsResponse {
    getSystemConfigs: SystemConfig[];
}

export interface GetSystemConfigResponse {
    getSystemConfig: SystemConfig;
}

export interface UpdateSystemConfigInput {
    key: string;
    value: string;
    description?: string;
    dataType?: string;
}

export interface UpdateSystemConfigResponse {
    updateSystemConfig: SystemConfig;
}

export interface DeleteSystemConfigResponse {
    deleteSystemConfig: {
        success: boolean;
        message: string;
    };
}
