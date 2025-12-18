export enum DeliveryTaskStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REJECTED = 'REJECTED'
}

export interface DeliveryTaskFilterInput {
    campaignId?: string;
    campaignPhaseId?: string;
    mealBatchId?: string;
    deliveryStaffId?: string;
    status?: DeliveryTaskStatus;
    limit?: number;
    offset?: number;
}

export interface DeliveryStaff {
    id: string;
    full_name: string;
}

export interface MealBatch {
    id: string;
    foodName: string;
    quantity: number;
    cookedDate: string;
    status: string;
}

export interface StatusLog {
    id: string;
    status: DeliveryTaskStatus;
    note?: string;
    changedBy: string;
    createdAt: string;
    user?: {
        id: string;
        full_name: string;
    };
}

export interface DeliveryTask {
    id: string;
    deliveryStaff: DeliveryStaff;
    mealBatchId: string;
    mealBatch?: MealBatch;
    status: DeliveryTaskStatus;
    created_at: string;
    updated_at?: string;
    statusLogs?: StatusLog[];
}

export interface GetDeliveryTasksResponse {
    deliveryTasks: DeliveryTask[];
}

export interface GetDeliveryTaskByIdResponse {
    deliveryTask: DeliveryTask;
}
