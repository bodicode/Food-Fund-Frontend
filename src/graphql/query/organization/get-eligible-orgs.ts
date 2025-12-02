import { gql } from "@apollo/client";

export const GET_ELIGIBLE_ORGS = gql`
  query GetEligibleOrgs($campaignId: String!) {
    getEligibleOrganizationsForReassignment(campaignId: $campaignId) {
      success
      message
      total
      organizations {
        id
        name
        representativeName
        activityField
        address
        phoneNumber
        email
      }
    }
  }
`;
