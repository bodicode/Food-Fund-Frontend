import { gql } from "@apollo/client";

export const GET_CAMPAIGN_POSTS = gql`
  query GetPost($campaignId: String!) {
    post(campaignId: $campaignId) {
      id
      campaignId
      title
      content
      media
      creator {
        id
        full_name
      }
      likeCount
      commentCount
      isLikedByMe
    }
  }
`;
