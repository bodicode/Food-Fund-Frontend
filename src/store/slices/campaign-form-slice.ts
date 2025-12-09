import { CreateCampaignInput } from "@/types/api/campaign";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CampaignFormState = Partial<CreateCampaignInput> & {
  // Legacy fields for backward compatibility (not sent to backend)
  ingredientBudgetPercentage?: string;
  cookingBudgetPercentage?: string;
  deliveryBudgetPercentage?: string;
};

const initialState: CampaignFormState = {
  title: "",
  description: "",
  coverImageFileKey: "",
  targetAmount: "",
  categoryId: "",
  fundraisingStartDate: "",
  fundraisingEndDate: "",
  phases: [
    {
      phaseName: "Giai đoạn 1",
      location: "",
      ingredientPurchaseDate: "",
      cookingDate: "",
      deliveryDate: "",
      ingredientBudgetPercentage: "",
      cookingBudgetPercentage: "",
      deliveryBudgetPercentage: "",
      plannedMeals: [],
      plannedIngredients: [],
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