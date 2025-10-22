export type UserProfile = {
  address?: string | null;
  avatar_url: string;
  bio: string;
  created_at: string;
  email: string;
  full_name: string;
  id: string;
  is_active: boolean;
  phone_number?: string | null;
  role: string;
  updated_at: string;
  user_name: string;
};

export type UpdateMyProfileInput = {
  address?: string;
  avatar_url?: string;
  bio?: string;
  full_name?: string;
  phone_number?: string;
};

export type UpdateUserAccountInput = {
  avatar_url?: string;
  bio?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  phone_number?: string;
};