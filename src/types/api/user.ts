export type Milestone = {
  name: string;
  badgeId: string;
  minAmount: number;
  priority: number;
  description: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  milestone?: Milestone;
};

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
  badge?: Badge | null;
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