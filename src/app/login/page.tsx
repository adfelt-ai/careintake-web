"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      
      // Firebase automatically maintains the session
      // The AuthProvider will detect the auth state change
      
      toast.success("Welcome back!", {
        description: `Successfully signed in as ${userCredential.user.email}`,
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      let errorTitle = "Login Failed";
      let errorMessage = "Invalid email or password. Please try again.";
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case "auth/user-not-found":
          errorTitle = "Account Not Found";
          errorMessage = "No account found with this email address. Please check your email or sign up.";
          break;
        case "auth/wrong-password":
          errorTitle = "Incorrect Password";
          errorMessage = "The password you entered is incorrect. Please try again.";
          break;
        case "auth/invalid-email":
          errorTitle = "Invalid Email";
          errorMessage = "The email address format is invalid. Please enter a valid email.";
          break;
        case "auth/invalid-credential":
          errorTitle = "Invalid Credentials";
          errorMessage = "The email or password is incorrect. Please check your credentials and try again.";
          break;
        case "auth/too-many-requests":
          errorTitle = "Too Many Attempts";
          errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
          break;
        case "auth/user-disabled":
          errorTitle = "Account Disabled";
          errorMessage = "This account has been disabled. Please contact support.";
          break;
        case "auth/network-request-failed":
          errorTitle = "Network Error";
          errorMessage = "Unable to connect. Please check your internet connection and try again.";
          break;
        case "auth/operation-not-allowed":
          errorTitle = "Operation Not Allowed";
          errorMessage = "Email/password sign-in is not enabled. Please contact support.";
          break;
        default:
          errorTitle = "Login Error";
          errorMessage = error.message || "An unexpected error occurred. Please try again.";
      }
      
      toast.error(errorTitle, {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Image
              src="/adfelt-logo.png"
              alt="AdFelt Logo"
              width={120}
              height={40}
              className="h-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-10 h-11"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 h-11"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />                

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>

            {/* <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </div> */}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} AdFelt. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
