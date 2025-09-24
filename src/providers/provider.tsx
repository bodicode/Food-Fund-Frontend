"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { ApolloWrapper } from "./apollo-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ApolloWrapper>
          {children}
          <Toaster richColors theme="light" position="top-center" />
        </ApolloWrapper>
      </PersistGate>
    </Provider>
  );
}
