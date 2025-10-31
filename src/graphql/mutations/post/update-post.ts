import { gql } from "@apollo/client";

export const UPDATE_POST = gql`
  mutation UpdatePost($id: String!, $input: UpdatePostInput!) {
    updatePost(id: $id, input: $input) {
      success
      message
      post {
        id
        title
        content
        media
        updated_at
      }
    }
  }
`;