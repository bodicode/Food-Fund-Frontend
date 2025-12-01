import { gql } from "@apollo/client";

export const CHANGE_CAMPAIGN_STATUS = gql`
  mutation ChangeCampaignStatus($input: ChangeStatusInput!) {
    changeCampaignStatus(input: $input) {
      id
      status
      reason
      changedStatusAt
    }
  }
`;