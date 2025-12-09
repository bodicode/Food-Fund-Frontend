import { gql } from "@apollo/client";

export const UPDATE_SYSTEM_CONFIG = gql`
  mutation UpdateSystemConfig($input: UpdateSystemConfigInput!) {
    updateSystemConfig(input: $input) {
      dataType
      description
      key
      value
      updatedAt
    }
  }
`;

export const DELETE_SYSTEM_CONFIG = gql`
  mutation DeleteSystemConfig($key: String!) {
    deleteSystemConfig(key: $key) {
      message
      success
    }
  }
`;
