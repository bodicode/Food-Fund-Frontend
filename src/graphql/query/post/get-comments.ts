import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query GetPostCommentsTree($postId: String!) {
    postCommentsTree(postId: $postId, limit: 20, offset: 0) {
      id
      content
      depth
      userId
      user { 
        full_name
        avatar_url
      }
      created_at
      replies {
        id
        content
        depth
        userId
        user { 
          full_name
          avatar_url
        }
        created_at
        replies {
          id
          content
          depth
          userId
          user { 
            full_name
            avatar_url
          }
          created_at
        }
      }
    }
  }
`;
