"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { PUBLIC_ROUTES } from "../_utils/constants";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

// List of routes that should be accessible without authentication
const PUBLIC_PATHS = [
  /^\/manager\/invite\/[a-f0-9]{64}$/i, // matches /manager/invite/<64 hex chars>
  /^\/(?:[a-z]{2}\/)?invite\/accept$/i,
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((regex) => regex.test(pathname));
}

const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle route protection based on auth state
  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be determined

    const currentPath = pathname || "";
    const isLoginPage = currentPath === PUBLIC_ROUTES.LOGIN || currentPath.includes("/login");

    // Allow public invite page to load without authentication
    if (isPublicPath(currentPath)) {
      return;
    }

    if (isAuthenticated && user) {
      // User is authenticated - redirect from login to dashboard
      if (
        currentPath.includes("/login") ||
        currentPath === "/en" ||
        currentPath === "/de" ||
        currentPath === "/invite/accept" ||
        currentPath === "/"
      ) {
        router.push("/dashboard");
      }
    } else {
      // User is not authenticated - protect all routes except login
      if (!isPublicPath(currentPath) && !isLoginPage) {
        router.push(PUBLIC_ROUTES.LOGIN);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, isLoading, pathname]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 border-4 border-primary/20 rounded-full" />
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">Loading</p>
            <p className="text-xs text-muted-foreground">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // If on a public invite page, just render children (no sidebar/header)
  if (isPublicPath(pathname || "")) {
    return <div className="w-full h-[100vh]">{children}</div>;
  }

  // If not authenticated, render children (login page will be shown)
  if (!isAuthenticated) {
    return <div className="w-full h-[100vh]">{children}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <div className="h-full flex-1 overflow-hidden relative z-10">
          <Header />
          <main className="overflow-y-scroll" style={{ height: "calc(100vh - 60px)" }}>
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AuthProvider;
