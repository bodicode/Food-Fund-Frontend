import { gql } from "@apollo/client";

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: String!, $input: UpdateCommentInput!) {
    updateComment(commentId: $commentId, input: $input) {
      success
      message
      comment {
        id
        content
        updated_at
      }
    }
  }
`;
