"use client";

import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode, Suspense } from "react";
import AuthProvider from "./AuthProvider";
import { store } from "./store/store";

export default function StoreProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </Suspense>
    </Provider>
  );
}