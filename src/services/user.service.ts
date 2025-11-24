import { GET_USER_PROFILE } from "@/graphql/query/auth/get-user";
import { GET_MY_PROFILE } from "@/graphql/query/auth/get-my-profile";
import { GET_ALL_USERS } from "@/graphql/query/auth/get-all-users";
import client from "@/lib/apollo-client";
import { UserProfile, UpdateMyProfileInput, UpdateUserAccountInput } from "@/types/api/user";
import { UPDATE_MY_PROFILE } from "@/graphql/mutations/auth/update-my-profile";
import { UPDATE_USER_ACCOUNT } from "@/graphql/mutations/auth/update-user-account";
import { GENERATE_AVATAR_UPLOAD_URL } from "@/graphql/mutations/auth/generate-avatar-upload-url";
import { CHECK_CURRENT_PASSWORD } from "@/graphql/mutations/auth/check-current-password";
import { CHANGE_PASSWORD } from "@/graphql/mutations/auth/change-password";

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

  checkCurrentPassword: async (
    currentPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await client.mutate<{
        checkCurrentPassword: { message: string };
      }>({
        mutation: CHECK_CURRENT_PASSWORD,
        variables: {
          input: { currentPassword },
        },
      });

      if (data?.checkCurrentPassword) {
        const message = data.checkCurrentPassword.message;
        
        // Check if message indicates invalid password
        if (message.toLowerCase().includes("invalid")) {
          return { success: false, message };
        }
        
        return { success: true, message };
      }
      return { success: false, message: "Không thể xác thực mật khẩu" };
    } catch (error: unknown) {
      // Extract message from GraphQL error
      const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
      const message =
        err?.graphQLErrors?.[0]?.message ||
        err?.message ||
        "Mật khẩu không chính xác";
      return { success: false, message };
    }
  },

  changePassword: async (
    newPassword: string,
    confirmNewPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await client.mutate<{
        changePassword: { message: string; timestamp: string };
      }>({
        mutation: CHANGE_PASSWORD,
        variables: {
          input: { newPassword, confirmNewPassword },
        },
      });

      if (data?.changePassword) {
        return { success: true, message: data.changePassword.message };
      }
      return { success: false, message: "Không thể đổi mật khẩu" };
    } catch (error: unknown) {
      // Extract message from GraphQL error
      const err = error as { graphQLErrors?: Array<{ message: string }>; message?: string };
      const message =
        err?.graphQLErrors?.[0]?.message ||
        err?.message ||
        "Có lỗi xảy ra khi đổi mật khẩu";
      return { success: false, message };
    }
  },
};
