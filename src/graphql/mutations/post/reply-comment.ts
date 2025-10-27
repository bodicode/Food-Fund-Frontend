import { gql } from "@apollo/client";

export const REPLY_COMMENT = gql`
  mutation ReplyComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      success
      message
      comment {
        id
        postId
        parentCommentId
        depth
        content
      }
    }
  }
`;
