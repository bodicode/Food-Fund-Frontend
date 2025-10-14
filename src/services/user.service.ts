import { GET_USER_PROFILE } from "@/graphql/query/auth/get-user";
import { GET_MY_PROFILE } from "@/graphql/query/auth/get-my-profile";
import client from "@/lib/apollo-client";
import { UserProfile, UpdateMyProfileInput } from "@/types/api/user";
import { UPDATE_MY_PROFILE } from "@/graphql/mutations/auth/update-my-profile";

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
};
