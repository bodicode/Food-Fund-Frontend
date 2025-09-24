import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($input: SignInInput!) {
    signIn(input: $input) {
      expiresIn
      accessToken
      idToken
      message
      refreshToken
      user {
        id
        name
        email
        username
        provider
        createdAt
      }
    }
  }
`;
