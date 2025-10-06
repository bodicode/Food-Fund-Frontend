import { CreateCampaignInput } from "@/types/api/campaign";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CampaignFormState = Partial<CreateCampaignInput>;

const initialState: CampaignFormState = {
    title: "",
    description: "",
    coverImageFileKey: "",
    location: "",
    targetAmount: "",
    startDate: "",
    endDate: "",
    categoryId: "",
};

const campaignFormSlice = createSlice({
    name: "campaignForm",
    initialState,
    reducers: {
        updateForm: (state, action: PayloadAction<Partial<CampaignFormState>>) => {
            return { ...state, ...action.payload };

            // Cách 2: Mutate từng field
            // Object.keys(action.payload).forEach(key => {
            //     state[key as keyof CampaignFormState] = action.payload[key as keyof CampaignFormState];
            // });
        },
        resetForm: () => initialState,
    },
});

export const { updateForm, resetForm } = campaignFormSlice.actions;
export default campaignFormSlice.reducer;