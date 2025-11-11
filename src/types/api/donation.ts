// ==============================
// DONATION TYPES
// ==============================
export interface CreateDonationInput {
  amount: number;
  campaignId: string;
  isAnonymous: boolean;
  description?: string;
}

export interface DonationResponse {
  amount: number;
  bankAccountName: string;
  bankFullName: string;
  bankLogo: string;
  bankName: string;
  bankNumber: string;
  description: string;
  donationId: string;
  qrCode: string;
}

export interface CreateDonationResponse {
  createDonation: DonationResponse;
}

// ==============================
// CAMPAIGN DONATIONS TYPES
// ==============================
export interface CampaignDonation {
  amount: number;
  donorName: string;
  transactionDatetime: string;
}

export type DonationSortField = "AMOUNT" | "CREATED_AT" | "TRANSACTION_DATE";
export type SortOrder = "ASC" | "DESC";

export interface GetCampaignDonationsParams {
  campaignId: string;
  skip?: number;
  take?: number;
  sortBy?: DonationSortField;
  sortOrder?: SortOrder;
  searchDonorName?: string;
}

export interface GetCampaignDonationsResponse {
  getCampaignDonations: CampaignDonation[];
}

// ==============================
// MY DONATIONS TYPES
// ==============================
export interface DonationDetail {
  campaignId: string;
  donorName: string;
  donorId: string;
  id: string;
  isAnonymous: boolean;
  status: string;
  orderCode: string;
  transactionDatetime: string;
}

export interface MyDonationItem {
  amount: number;
  orderCode: string;
  donation: DonationDetail;
  paymentAmountStatus: string;
  receivedAmount: number;
  transactionStatus: string;
}

export interface MyDonation {
  amount: number;
  campaignId: string;
  donorName: string;
  donorId: string;
  id: string;
  isAnonymous: boolean;
  status: string;
  orderCode: string;
  transactionDatetime: string;
  paymentAmountStatus?: string;
  receivedAmount?: number;
  transactionStatus?: string;
}

export interface MyDonationsData {
  donations: MyDonationItem[];
  totalAmount: number;
  totalSuccessDonations: number;
  totalDonatedCampaigns: number;
}

export interface GetMyDonationsParams {
  skip?: number;
  take?: number;
}

export interface GetMyDonationsResponse {
  getMyDonations: MyDonationsData;
}


// ==============================
// DONATION DETAIL TYPES
// ==============================
export interface DonationTransaction {
  reference: string;
  amount: number;
  accountNumber: string;
  description: string;
  transactionDateTime: string;
}

export interface DonationPaymentDetail {
  id: string;
  orderCode: string;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  status: string;
  createdAt: string;
  transactions: DonationTransaction[];
  qrCode?: string;
  bankNumber?: string;
  bankAccountName?: string;
  bankFullName?: string;
  bankName?: string;
  bankLogo?: string;
  description?: string;
}

export interface GetDonationPaymentLinkResponse {
  getMyDonationPaymentLink: DonationPaymentDetail;
}
