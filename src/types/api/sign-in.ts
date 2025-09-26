export type SignInInput = {
  email: string;
  password: string;
};

export type SignInUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  provider: string;
  createdAt: string;
};

export type SignInResponse = {
  signIn: {
    expiresIn: number;
    accessToken: string;
    idToken: string;
    message: string;
    refreshToken: string;
    user: SignInUser;
  };
};
