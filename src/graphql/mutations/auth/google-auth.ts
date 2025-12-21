import { gql } from "@apollo/client";

export const GOOGLE_AUTH_MUTATION = gql`
  mutation googleAuthentication($googleAuthenticationInput2: GoogleAuthInput!) {
    googleAuthentication(input: $googleAuthenticationInput2) {
      accessToken
      expiresIn
      idToken
      isNewUser
      message
      refreshToken
      user {
        createdAt
        email
        emailVerified
        id
        name
        phoneNumber
        provider
        updatedAt
        username
      }
    }
  }
`;


