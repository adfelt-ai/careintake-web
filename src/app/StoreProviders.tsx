"use client";

import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import { store } from "./store/store";

export default function StoreProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </Provider>
  );
}