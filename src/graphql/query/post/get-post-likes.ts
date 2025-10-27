import { gql } from "@apollo/client";

export const GET_POST_LIKES = gql`
  query PostLikes($postId: String!, $limit: Int, $offset: Int) {
    postLikes(postId: $postId, limit: $limit, offset: $offset) {
      id
      user {
        id
        full_name
      }
    }
  }
`;
