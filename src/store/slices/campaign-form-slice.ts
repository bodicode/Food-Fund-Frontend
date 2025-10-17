import { CreateCampaignInput } from "@/types/api/campaign";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CampaignFormState = Partial<CreateCampaignInput>;

const initialState: CampaignFormState = {
  title: "",
  description: "",
  coverImageFileKey: "",
  location: "",
  targetAmount: "",

  ingredientBudgetPercentage: "",
  cookingBudgetPercentage: "",
  deliveryBudgetPercentage: "",

  fundraisingStartDate: "",
  fundraisingEndDate: "",

  ingredientPurchaseDate: "",
  cookingDate: "",
  deliveryDate: "",

  categoryId: "",
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