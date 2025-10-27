import { gql } from "@apollo/client";

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: String!) {
    unlikePost(postId: $postId) {
      success
      isLiked
      likeCount
    }
  }
`;
