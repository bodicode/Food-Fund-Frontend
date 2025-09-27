import { UPDATE_USER_PROFILE } from "@/graphql/mutations/update-user-profile";
import { GET_USER_PROFILE } from "@/graphql/query/get-user";
import client from "@/lib/apollo-client";
import { UserProfile } from "@/types/api/user";

export const userService = {
  getProfile: async (): Promise<UserProfile | null> => {
    const { data } = await client.query<{ getUserProfile: UserProfile }>({
      query: GET_USER_PROFILE,
    });

    if (!data || !data.getUserProfile) {
      return null;
    }

    return data.getUserProfile;
  },

  updateProfile: async (
    input: Partial<UserProfile>
  ): Promise<UserProfile | null> => {
    const { data } = await client.mutate<{ updateUser: UserProfile }>({
      mutation: UPDATE_USER_PROFILE,
      variables: { updateUserProfileInput: input },
    });
    return data?.updateUser ?? null;
  },
};
