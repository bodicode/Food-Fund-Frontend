import client from "@/lib/apollo-client";
import { GET_CAMPAIGN_DONATION_STATEMENT } from "@/graphql/query/donation/get-campaign-donation-statement";
import { CampaignDonationStatement } from "@/types/api/donation-statement";

interface GetCampaignDonationStatementResponse {
  getCampaignDonationStatement: CampaignDonationStatement;
}

export const donationStatementService = {
  async getCampaignDonationStatement(
    campaignId: string
  ): Promise<CampaignDonationStatement> {
    const result = await client.query<GetCampaignDonationStatementResponse>({
      query: GET_CAMPAIGN_DONATION_STATEMENT,
      variables: { campaignId },
      fetchPolicy: "network-only",
    });

    if (!result.data) {
      throw new Error("No data returned from query");
    }

    return result.data.getCampaignDonationStatement;
  },
};
