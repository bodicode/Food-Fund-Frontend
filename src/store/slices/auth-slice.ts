import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role?: string;
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
      Cookies.set("accessToken", accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        secure: true,
        sameSite: "strict",
      });
      if (user.role) {
        Cookies.set("role", user.role, { secure: true, sameSite: "strict" });
      }
    },

    restoreSession: (state) => {
      try {
        const user = localStorage.getItem("user");
        const accessToken = Cookies.get("accessToken") || null;
        const refreshToken = Cookies.get("refreshToken") || null;

        if (user && accessToken && refreshToken) {
          state.user = JSON.parse(user);
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
        }
      } catch (e) {
        console.error("Restore session failed:", e);
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      // Clear localStorage
      localStorage.removeItem("user");

      // Clear cookies
      Cookies.remove("accessToken", { secure: true, sameSite: "strict" });
      Cookies.remove("refreshToken", { secure: true, sameSite: "strict" });
      Cookies.remove("role", { secure: true, sameSite: "strict" });
      Cookies.remove("idToken", { secure: true, sameSite: "strict" });
    },
  },
});

export const { setCredentials, restoreSession, logout } = authSlice.actions;
export default authSlice.reducer;
