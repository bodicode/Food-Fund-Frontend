import { gql } from "@apollo/client";

export const GET_CAMPAIGN_POSTS = gql`
  query GetPostsByCampaign(
    $campaignId: String!
    $sortBy: PostSortOrder
    $limit: Int
    $offset: Int
  ) {
    postsByCampaign(
      campaignId: $campaignId
      sortBy: $sortBy
      limit: $limit
      offset: $offset
    ) {
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
      created_at
    }
  }
`;
