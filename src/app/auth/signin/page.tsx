"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, Mail, Lock, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        // Get the updated session to check user role
        const session = await getSession();
        if (session?.user) {
          if (session.user.role === "ADMIN") {
            router.push("/admin");
          } else {
            // For regular users, check if they need to complete profile setup
            try {
              const response = await fetch('/api/user/profile-status');
              const profileStatus = await response.json();

              if (profileStatus.needsSetup) {
                router.push("/profile?setup=true");
              } else {
                router.push("/dashboard");
              }
            } catch {
              // Fallback to dashboard if profile check fails
              router.push("/dashboard");
            }
          }
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickSignIn = async (userType: 'admin' | 'student') => {
    setIsLoading(true);
    setError("");

    const credentials = userType === 'admin'
      ? { email: 'admin@buconnect.com', password: 'admin123' }
      : { email: 'student@buconnect.com', password: 'student123' };

    setEmail(credentials.email);
    setPassword(credentials.password);

    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        setError("Demo account sign-in failed. Please try again.");
      } else {
        const session = await getSession();
        if (session?.user?.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-picton-blue via-blue-500 to-sandy-brown flex items-center justify-center p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sandy-brown/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 dark:border dark:border-gray-700">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center space-x-2 mb-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-picton-blue to-sandy-brown rounded-2xl flex items-center justify-center shadow-lg">
                <Handshake className="w-7 h-7 text-white" />
              </div>
              <span className="text-gray-900 dark:text-gray-100 font-heading font-bold text-3xl">BU Connect</span>
            </motion.div>

            <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 mb-2">Welcome back!</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Access your skills, help requests, and collaborations
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Demo Access */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800/50">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                Quick Demo Access
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickSignIn('admin')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Admin Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickSignIn('student')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Student Demo
                </Button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Explore the full platform with sample data and features
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with your account</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-200 font-medium">Sign in failed</p>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@bicol-u.edu.ph"
                leftIcon={<Mail className="w-4 h-4" />}
                required
                disabled={isLoading}
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                required
                disabled={isLoading}
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 dark:border-gray-600 text-picton-blue focus:ring-picton-blue dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                  />
                  <span className="ml-2 text-gray-600 dark:text-gray-300">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-picton-blue hover:text-picton-blue/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={isLoading}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {isLoading ? "Signing you in..." : "Sign In"}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                New to BU Connect?{" "}
                <Link
                  href="/auth/signup"
                  className="text-picton-blue hover:text-picton-blue/80 font-semibold transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to home</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
