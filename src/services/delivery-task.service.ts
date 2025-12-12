import { client } from "@/lib/apollo-client";
import { GET_DELIVERY_TASKS, GET_DELIVERY_TASK_BY_ID } from "@/graphql/query/delivery-task";
import { DeliveryTaskFilterInput, GetDeliveryTasksResponse, GetDeliveryTaskByIdResponse, DeliveryTask } from "@/types/delivery-task";

export const deliveryTaskService = {
    getDeliveryTasks: async (filter: DeliveryTaskFilterInput): Promise<DeliveryTask[]> => {
        try {
            const { data } = await client.query<GetDeliveryTasksResponse>({
                query: GET_DELIVERY_TASKS,
                variables: { filter },
                fetchPolicy: "no-cache"
            });
            return data?.deliveryTasks || [];
        } catch (error) {
            console.error("Error fetching delivery tasks:", error);
            throw error;
        }
    },

    getDeliveryTaskById: async (id: string): Promise<DeliveryTask> => {
        try {
            const { data } = await client.query<GetDeliveryTaskByIdResponse>({
                query: GET_DELIVERY_TASK_BY_ID,
                variables: { id },
                fetchPolicy: "no-cache"
            });
            if (!data?.deliveryTask) {
                throw new Error("Delivery task not found");
            }
            return data.deliveryTask;
        } catch (error) {
            console.error("Error fetching delivery task by id:", error);
            throw error;
        }
    },
};
