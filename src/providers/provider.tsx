"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { ApolloWrapper } from "./apollo-provider";
import { TokenRefreshProvider } from "./token-refresh-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AUTH_CONFIG } from "@/constants";

const clientId = AUTH_CONFIG.GOOGLE_CLIENT_ID;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloWrapper>
          <TokenRefreshProvider>
            <GoogleOAuthProvider clientId={clientId}>
              {children}
              <Toaster richColors theme="light" position="top-center" />
            </GoogleOAuthProvider>
          </TokenRefreshProvider>
        </ApolloWrapper>
      </PersistGate>
    </ReduxProvider>
  );
}
