import { LOGIN_MUTATION } from "@/graphql/mutations/login";
import { SignInInput, SignInResponse } from "@/types";
import client from "@/lib/apollo-client";

export const authService = {
  async login(input: SignInInput): Promise<SignInResponse["signIn"]> {
    const { data } = await client.mutate<
      { signIn: SignInResponse["signIn"] },
      { input: SignInInput }
    >({
      mutation: LOGIN_MUTATION,
      variables: { input },
    });
    if (!data?.signIn) throw new Error("Login failed");
    return data.signIn;
  },
};
