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

export type GoogleAuthInput = {
  idToken: string;
};

export type GoogleAuthUser = {
  createdAt: string;
  email: string;
  emailVerified: boolean;
  id: string;
  name: string;
  phoneNumber?: string | null;
  provider: string;
  updatedAt: string;
  username: string;
};

export type GoogleAuthResponse = {
  googleAuthentication: {
    accessToken: string;
    expiresIn: number;
    idToken: string;
    isNewUser: boolean;
    message: string;
    refreshToken: string;
    user: GoogleAuthUser;
  };
};