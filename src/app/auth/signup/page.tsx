"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Handshake, Mail, Lock, User, AlertCircle, ArrowLeft, CheckCircle, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme-toggle";

const colleges = [
  "College of Engineering",
  "College of Science",
  "College of Arts and Letters",
  "College of Business Economics and Management",
  "College of Education",
  "College of Medicine",
  "College of Agriculture and Forestry",
  "College of Social Sciences and Philosophy",
];

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    department: "",
    year: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don&apos;t match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          department: formData.department,
          year: parseInt(formData.year),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Auto sign-in the new user and redirect to profile setup
        setTimeout(async () => {
          const signInResult = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
          });

          if (signInResult?.ok) {
            // Redirect to profile to complete setup
            router.push("/profile?welcome=true");
          } else {
            // Fallback to sign-in page
            router.push("/auth/signin?message=Please sign in with your new account");
          }
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Smart Peer Matching",
      description: "Connect with students who have the exact skills you need or want to learn"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Skill Exchange Hub",
      description: "Offer your expertise and discover learning opportunities across all majors"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Reputation System",
      description: "Build trust through verified collaborations and peer feedback"
    }
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Welcome to BU Connect! 🎉</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your account has been created successfully! We&apos;re signing you in and taking you to your profile to complete your setup.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-picton-blue"></div>
          </div>
        </motion.div>
      </div>
    );
  }

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

      <div className="w-full max-w-4xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center space-y-8 text-white dark:text-gray-100"
          >
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-3 mb-6"
              >
                <div className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Handshake className="w-7 h-7 text-white" />
                </div>
                <span className="font-heading font-bold text-3xl">BU Connect</span>
              </motion.div>

              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Join the most active student collaboration platform at Bicol University
              </h1>
              <p className="text-xl text-white/90 dark:text-gray-300 mb-8">
                Access comprehensive skill-sharing, help request system, and build your academic network with verified BU students.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-10 h-10 bg-white/20 dark:bg-white/10 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-white/80 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 dark:border dark:border-gray-700">
              <CardHeader className="text-center pb-6">
                {/* Mobile logo */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex lg:hidden items-center justify-center space-x-2 mb-6"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-picton-blue to-sandy-brown rounded-2xl flex items-center justify-center shadow-lg">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-heading font-bold text-2xl">BU Connect</span>
                </motion.div>

                <CardTitle className="text-2xl text-gray-900 dark:text-gray-100 mb-2">Create Your Account</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Join 2,800+ BU students already collaborating and learning together
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium">Registration failed</p>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Sign Up Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Full Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan Dela Cruz"
                    leftIcon={<User className="w-4 h-4" />}
                    required
                    disabled={isLoading}
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.name@bicol-u.edu.ph"
                    leftIcon={<Mail className="w-4 h-4" />}
                    required
                    disabled={isLoading}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="college" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        College
                      </label>
                      <select
                        id="college"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Select College</option>
                        {colleges.map((college) => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year Level
                      </label>
                      <select
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-picton-blue focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                        <option value="5">5th Year</option>
                      </select>
                    </div>
                  </div>

                  <Input
                    label="Department/Program"
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    required
                    disabled={isLoading}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      leftIcon={<Lock className="w-4 h-4" />}
                      required
                      disabled={isLoading}
                    />

                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      leftIcon={<Lock className="w-4 h-4" />}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-0.5 rounded border-gray-300 dark:border-gray-600 text-picton-blue focus:ring-picton-blue dark:bg-gray-700 dark:focus:ring-offset-gray-800"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-picton-blue hover:text-picton-blue/80 font-medium">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-picton-blue hover:text-picton-blue/80 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    {isLoading ? "Creating your account..." : "Create Account"}
                  </Button>
                </form>

                {/* Sign In Link */}
                <div className="text-center pt-6 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/auth/signin"
                      className="text-picton-blue hover:text-picton-blue/80 font-semibold transition-colors"
                    >
                      Sign in
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
      </div>
    </div>
  );
}
