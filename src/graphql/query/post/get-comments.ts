import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetComments($postId: String!, $parentCommentId: String, $limit: Int, $offset: Int) {
    postComments(postId: $postId, parentCommentId: $parentCommentId, limit: $limit, offset: $offset) {
      id
      postId
      user { 
        full_name
      }
      content
      parentCommentId
      depth
      replies {
        id
        content
        userId
      }
    }
  }
`;
