import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { COOKIE_NAMES } from "@/constants";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
  avatar_url?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload;

      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;

      // Save user info in localStorage (UI only)
      localStorage.setItem("user", JSON.stringify(user));

      // Save tokens & role in cookies (for security + middleware)
      // Access Token: 1 hour
      Cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        secure: true,
        sameSite: "strict",
        expires: 1 / 24,
      });
      // Refresh Token: 30 days
      Cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        secure: true,
        sameSite: "strict",
        expires: 30,
      });
      if (user.role) {
        Cookies.set(COOKIE_NAMES.ROLE, user.role, {
          secure: true,
          sameSite: "strict",
          expires: 30,
        });
      }


    },

    restoreSession: (state) => {
      try {
        const user = localStorage.getItem("user");
        const accessToken = Cookies.get(COOKIE_NAMES.ACCESS_TOKEN) || null;
        const refreshToken = Cookies.get(COOKIE_NAMES.REFRESH_TOKEN) || null;

        if (user && accessToken && refreshToken) {
          state.user = JSON.parse(user);
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
        }
      } catch (e) {
        console.error("Restore session failed:", e);
      }
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // Clear localStorage
      localStorage.removeItem("user");

      // Clear cookies
      Cookies.remove(COOKIE_NAMES.ACCESS_TOKEN, { secure: true, sameSite: "strict" });
      Cookies.remove(COOKIE_NAMES.REFRESH_TOKEN, { secure: true, sameSite: "strict" });
      Cookies.remove(COOKIE_NAMES.ROLE, { secure: true, sameSite: "strict" });
      Cookies.remove(COOKIE_NAMES.ID_TOKEN, { secure: true, sameSite: "strict" });


    },
  },
});

export const { setCredentials, restoreSession, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
