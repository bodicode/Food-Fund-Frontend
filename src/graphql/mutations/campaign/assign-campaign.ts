import { gql } from "@apollo/client";

export const ASSIGN_CAMPAIGN = gql`
  mutation AssignCampaign($input: AssignCampaignToOrganizationsInput!) {
    assignCampaignToOrganizations(input: $input) {
      success
      message
      assignedCount
      expiresAt
      assignments {
        id
        organizationId
        status
        assignedAt
        expiresAt
      }
    }
  }
`;
