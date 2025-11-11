export interface PaymentTransaction {
  amount: number;
  createdAt: string;
  description: string;
  id: string;
  orderCode: string;
  paymentAmountStatus: string;
  receivedAmount: number;
  transactionStatus: string;
  updatedAt: string;
}

export interface DonationDetails {
  campaignId: string;
  createdAt: string;
  donationId: string;
  isAnonymous: boolean;
  paymentTransaction: PaymentTransaction;
}

export interface GetDonationDetailsResponse {
  getMyDonationDetails: DonationDetails;
}
