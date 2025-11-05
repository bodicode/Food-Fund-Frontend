// Route paths
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    ADMIN: "/admin",
    KITCHEN: "/kitchen",
    DELIVERY: "/delivery",
} as const;

// User roles
export const USER_ROLES = {
    ADMIN: "ADMIN",
    DONOR: "DONOR",
    FUNDRAISER: "FUNDRAISER",
    KITCHEN_STAFF: "KITCHEN_STAFF",
    DELIVERY_STAFF: "DELIVERY_STAFF",
    KITCHEN: "KITCHEN",
    DELIVERY: "DELIVERY",
} as const;

// Role translations
export const ROLE_TRANSLATIONS = {
    [USER_ROLES.DONOR]: "Người ủng hộ",
    [USER_ROLES.ADMIN]: "Quản trị viên",
    [USER_ROLES.KITCHEN_STAFF]: "Nhân viên bếp",
    [USER_ROLES.DELIVERY_STAFF]: "Giao hàng",
    [USER_ROLES.FUNDRAISER]: "Nhà vận động",
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

// Helper function to check if a role is in a list of roles
export const isRoleInList = (role: string, roleList: UserRoleType[]): boolean => {
    return roleList.includes(role as UserRoleType);
};