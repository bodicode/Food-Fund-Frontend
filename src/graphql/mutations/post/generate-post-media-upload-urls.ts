import { gql } from "@apollo/client";

export const GENERATE_POST_MEDIA_UPLOAD_URLS = gql`
  mutation GeneratePostMediaUploadUrls($input: GeneratePostMediaUploadUrlsInput!) {
    generatePostMediaUploadUrls(input: $input) {
      success
      message
      uploadUrls {
        uploadUrl
        fileKey
        cdnUrl
        expiresAt
        fileType
      }
    }
  }
`;
