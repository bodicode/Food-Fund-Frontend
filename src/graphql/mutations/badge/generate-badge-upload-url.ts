import { gql } from "@apollo/client";

export const GENERATE_BADGE_UPLOAD_URL = gql`
  mutation GenerateBadgeUploadUrl($input: GenerateBadgeUploadUrlInput!) {
    generateBadgeUploadUrl(input: $input) {
      success
      message
      instructions
      uploadUrl {
        uploadUrl
        cdnUrl
        fileKey
        fileType
        expiresAt
      }
    }
  }
`;
