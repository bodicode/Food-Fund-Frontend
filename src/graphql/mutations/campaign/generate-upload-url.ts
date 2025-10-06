import { gql } from "@apollo/client";

export const GENERATE_CAMPAIGN_IMAGE_UPLOAD_URL = gql`
  mutation GenerateUploadUrl($input: GenerateUploadUrlInput!) {
    generateCampaignImageUploadUrl(input: $input) {
      uploadUrl
      fileKey
      expiresAt
      cdnUrl
      instructions
    }
  }
`;
