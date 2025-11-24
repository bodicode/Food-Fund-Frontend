import { gql } from "@apollo/client";

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshTokenInput2: RefreshTokenInput!) {
    refreshToken(input: $refreshTokenInput2) {
      accessToken
      expiresIn
      idToken
      message
    }
  }
`;
