import { gql } from "@apollo/client";

export const CHANGE_CAMPAIGN_STATUS = gql`
  mutation ChangeStatus($id: String!, $status: CampaignStatus!) {
    changeCampaignStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;