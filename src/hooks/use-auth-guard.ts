"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function useAuthGuard() {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = !!currentUser;

  const requireAuth = (callback?: () => void) => {
    if (isAuthenticated) {
      callback?.();
      return true;
    } else {
      setIsLoginDialogOpen(true);
      return false;
    }
  };

  const closeLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  return {
    isAuthenticated,
    currentUser,
    isLoginDialogOpen,
    requireAuth,
    closeLoginDialog,
  };
}