import { CreateCampaignInput } from "@/types/api/campaign";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CampaignFormState = Partial<CreateCampaignInput>;

const initialState: CampaignFormState = {
  title: "",
  description: "",
  coverImageFileKey: "",
  targetAmount: "",
  categoryId: "",
  ingredientBudgetPercentage: "60.00",
  cookingBudgetPercentage: "25.00", 
  deliveryBudgetPercentage: "15.00",
  fundraisingStartDate: "",
  fundraisingEndDate: "",
  phases: [
    {
      phaseName: "Giai đoạn 1",
      location: "",
      ingredientPurchaseDate: "",
      cookingDate: "",
      deliveryDate: "",
    },
  ],
};

const campaignFormSlice = createSlice({
  name: "campaignForm",
  initialState,
  reducers: {
    updateForm: (state, action: PayloadAction<Partial<CampaignFormState>>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => ({ ...initialState }),
  },
});

export const { updateForm, resetForm } = campaignFormSlice.actions;
export default campaignFormSlice.reducer;