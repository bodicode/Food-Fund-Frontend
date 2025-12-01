export interface DonationTransaction {
  donationId: string;
  transactionDateTime: string;
  donorName: string;
  amount: number;
  receivedAmount: number;
  gateway: string;
  orderCode: string;
  bankAccountNumber: string;
  bankName: string;
  description: string;
}

export interface CampaignDonationStatement {
  campaignId: string;
  campaignTitle: string;
  totalReceived: number;
  totalDonations: number;
  generatedAt: string;
  transactions: DonationTransaction[];
}
