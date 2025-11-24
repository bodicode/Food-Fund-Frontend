import { gql } from "@apollo/client";

export const GENERATE_AVATAR_UPLOAD_URL = gql`
  mutation GenerateAvatarUploadUrl($input: GenerateAvatarUploadUrlInput!) {
    generateAvatarUploadUrl(input: $input) {
      instructions
      message
      success
      uploadUrl {
        cdnUrl
        expiresAt
        fileKey
        fileType
        uploadUrl
      }
    }
  }
`;
