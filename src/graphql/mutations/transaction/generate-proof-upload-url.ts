import { gql } from "@apollo/client";

export const GENERATE_PROOF_UPLOAD_URL = gql`
  mutation GenerateProofUploadUrl($input: GenerateProofUploadUrlInput!) {
    generateProofUploadUrl(input: $input) {
      success
      message
      uploadUrl {
        uploadUrl
        fileKey
        cdnUrl
        expiresAt
        fileType
      }
      instructions
    }
  }
`;
