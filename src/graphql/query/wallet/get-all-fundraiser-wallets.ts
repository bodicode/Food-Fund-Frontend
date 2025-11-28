import { gql } from "@apollo/client";

export const GET_ALL_FUNDRAISER_WALLETS = gql`
  query GetAllFundraiserWallets($skip: Int!, $take: Int!) {
    getAllFundraiserWallets(skip: $skip, take: $take) {
      wallets {
        balance
        created_at
        id
        updated_at
        walletType
        user {
          address
          avatar_url
          bio
          created_at
          email
          full_name
          id
          is_active
          phone_number
          role
          user_name
        }
      }
    }
  }
`;
