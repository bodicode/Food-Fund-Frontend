import { GET_USER_PROFILE } from "@/graphql/query/auth/get-user";
import { GET_MY_PROFILE } from "@/graphql/query/auth/get-my-profile";
import { GET_ALL_USERS } from "@/graphql/query/auth/get-all-users";
import client from "@/lib/apollo-client";
import { UserProfile, UpdateMyProfileInput, UpdateUserAccountInput } from "@/types/api/user";
import { UPDATE_MY_PROFILE } from "@/graphql/mutations/auth/update-my-profile";
import { UPDATE_USER_ACCOUNT } from "@/graphql/mutations/auth/update-user-account";
import { GENERATE_AVATAR_UPLOAD_URL } from "@/graphql/mutations/auth/generate-avatar-upload-url";

export const userService = {
  getProfile: async (): Promise<UserProfile | null> => {
    const { data } = await client.query<{ getUserProfile: UserProfile }>({
      query: GET_USER_PROFILE,
      fetchPolicy: "cache-first",
    });

    if (!data || !data.getUserProfile) {
      return null;
    }

    return data.getUserProfile;
  },

  getMyProfile: async (): Promise<UserProfile | null> => {
    const { data } = await client.query<{
      getMyProfile: { message: string; userProfile: UserProfile | null };
    }>({
      query: GET_MY_PROFILE,
      fetchPolicy: "network-only",

    });

    return data?.getMyProfile?.userProfile ?? null;
  },

  getAllUsers: async (
    limit: number,
    offset: number
  ): Promise<UserProfile[]> => {
    const { data } = await client.query<{
      getAllUsers: UserProfile[];
    }>({
      query: GET_ALL_USERS,
      variables: { limit, offset },
      fetchPolicy: "network-only",
    });

    return data?.getAllUsers ?? [];
  },
  
  updateMyProfile: async (
    input: UpdateMyProfileInput
  ): Promise<UserProfile | null> => {
    const { data } = await client.mutate<{ updateMyProfile: UserProfile }>(
      {
        mutation: UPDATE_MY_PROFILE,
        variables: { input },
      }
    );
    return data?.updateMyProfile ?? null;
  },

  updateUserAccount: async (
    userId: string,
    input: UpdateUserAccountInput
  ): Promise<UserProfile | null> => {
    const { data } = await client.mutate<{ updateUserAccount: UserProfile }>({
      mutation: UPDATE_USER_ACCOUNT,
      variables: { userId, input },
    });
    return data?.updateUserAccount ?? null;
  },

  generateAvatarUploadUrl: async (
    mimeType: string
  ): Promise<{
    uploadUrl: string;
    fileKey: string;
    cdnUrl: string;
    expiresAt: string;
  } | null> => {
    // Convert MIME type to extension
    const toExtFromMime = (mime: string) => {
      const type = mime.toLowerCase();
      if (type.includes("jpeg") || type.includes("jpg")) return "jpeg";
      if (type.includes("png")) return "png";
      if (type.includes("webp")) return "webp";
      return "jpeg";
    };

    const { data } = await client.mutate<{
      generateAvatarUploadUrl: {
        success: boolean;
        uploadUrl: {
          uploadUrl: string;
          fileKey: string;
          cdnUrl: string;
          expiresAt: string;
        };
      };
    }>({
      mutation: GENERATE_AVATAR_UPLOAD_URL,
      variables: {
        input: {
          fileType: toExtFromMime(mimeType),
        },
      },
    });

    return data?.generateAvatarUploadUrl?.uploadUrl ?? null;
  },
};
