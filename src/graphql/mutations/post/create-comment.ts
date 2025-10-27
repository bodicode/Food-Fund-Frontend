import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      comment {
        id
        postId
        userId
        content
        parentCommentId
        created_at
      }
    }
  }
`;
