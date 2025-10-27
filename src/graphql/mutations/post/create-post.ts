import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      success
      message
      post {
        id
        campaignId
        createdBy
        title
        content
        media
        likeCount
        commentCount
        isActive
        created_at
      }
    }
  }
`;
