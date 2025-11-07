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