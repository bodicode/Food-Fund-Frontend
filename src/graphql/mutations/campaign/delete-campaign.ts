import { gql } from "@apollo/client";

export const DELETE_CAMPAIGN = gql`
  mutation DeleteCampaign($id: String!) {
    deleteCampaign(id: $id)
  }
`;
