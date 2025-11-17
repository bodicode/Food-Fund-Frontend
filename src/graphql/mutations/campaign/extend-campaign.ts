import { gql } from "@apollo/client";

export const EXTEND_CAMPAIGN = gql`
  mutation ExtendCampaign($id: String!, $input: ExtendCampaignInput!) {
    extendCampaign(id: $id, input: $input) {
      id
      fundraisingEndDate
      extensionCount
      phases {
        id
        phaseName
        ingredientPurchaseDate
        cookingDate
        deliveryDate
      }
    }
  }
`;
