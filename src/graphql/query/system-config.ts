import { gql } from "@apollo/client";

export const GET_SYSTEM_CONFIGS = gql`
  query GetSystemConfigs {
    getSystemConfigs {
      key
      value
      description
      dataType
      updatedAt
    }
  }
`;

export const GET_SYSTEM_CONFIG = gql`
  query GetSystemConfig($key: String!) {
    getSystemConfig(key: $key) {
      dataType
      description
      key
      value
      updatedAt
    }
  }
`;
