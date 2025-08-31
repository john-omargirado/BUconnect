"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, Lightbulb, ArrowRight, Handshake,
  Star, TrendingUp, MessageCircle, Shield, Zap,
  CheckCircle, Coffee, Heart, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/theme-toggle";

const stats = [
  { number: "2,847", label: "Active BUeños", icon: Users },
  { number: "1,500+", label: "Skills Offered", icon: BookOpen },
  { number: "950+", label: "Successful Collaborations", icon: Handshake },
  { number: "4.9", label: "Average Trust Score", icon: Star },
];

const features = [
  {
    icon: Users,
    title: "Smart Skill Matching",
    description: "Our intelligent system connects you with BU students who have complementary skills and interests for better collaborations.",
    color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    icon: Star,
    title: "Trust-Based Network",
    description: "Build your reputation through successful collaborations and verified peer reviews in our secure BU community.",
    color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  {
    icon: TrendingUp,
    title: "Academic Growth",
    description: "Enhance your learning experience by teaching others and acquiring new skills through peer-to-peer knowledge exchange.",
    color: "text-green-500 bg-green-100 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    icon: MessageCircle,
    title: "Integrated Communication",
    description: "Seamlessly communicate with your project partners using our built-in messaging and collaboration tools.",
    color: "text-purple-500 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    icon: Shield,
    title: "BU Verified Community",
    description: "Connect safely within the verified Bicol University student network with role-based access and moderation.",
    color: "text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-400",
  },
  {
    icon: Zap,
    title: "Instant Help Requests",
    description: "Get help quickly by posting requests that are matched with students who have the expertise you need.",
    color: "text-orange-500 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400",
  },
];

const testimonials = [
  {
    name: "Maria Santos",
    role: "Computer Science, 3rd Year",
    avatar: "MS",
    content: "BU Connect transformed my college experience! I found incredible teammates for my capstone project and even got tutoring help in advanced mathematics. The trust system really works!",
    rating: 5,
  },
  {
    name: "John Reyes",
    role: "Engineering, 4th Year",
    avatar: "JR",
    content: "As someone who&apos;s both offered skills and requested help, the platform is perfectly balanced. I&apos;ve taught Python programming and learned UI/UX design - amazing community!",
    rating: 5,
  },
  {
    name: "Ana Cruz",
    role: "Business Management, 2nd Year",
    avatar: "AC",
    content: "The user interface is so intuitive! I love how easy it is to browse skills, create help requests, and manage my profile. The search and filtering features are excellent.",
    rating: 5,
  },
];

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="rounded-full h-32 w-32 border-4 border-white border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
      >
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 xs:py-4">
          <nav className="flex justify-between items-center">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gradient-to-br from-primary to-secondary dark:from-primary dark:to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <Handshake className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
              </div>
              <span className="text-foreground font-heading font-bold text-lg xs:text-xl sm:text-2xl">BU Connect</span>
            </motion.div>

            <div className="flex items-center space-x-2 xs:space-x-4">
              <ThemeToggle />
              <Link href="/auth/signin" className="hidden xs:block">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signin" className="xs:hidden">
                <Button variant="ghost" size="sm" className="px-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" rightIcon={<ArrowRight className="w-3 h-3 xs:w-4 xs:h-4" />} className="text-xs xs:text-sm">
                  <span className="hidden xs:inline">Get Started</span>
                  <span className="xs:hidden">Join</span>
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-16 xs:pt-18 sm:pt-24 pb-8 xs:pb-12 sm:pb-16 bg-gradient-to-br from-picton-blue via-picton-blue to-sandy-brown relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12 sm:py-16 md:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-3 xs:mb-4 sm:mb-6 leading-tight px-2 xs:px-0"
            >
              Where BUeños{" "}
              <span className="text-yellow-200 relative block xs:inline">
                Collaborate
                <motion.div
                  className="absolute -bottom-0.5 xs:-bottom-1 sm:-bottom-2 left-0 right-0 h-0.5 sm:h-1 bg-yellow-200 rounded"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                />
              </span>{" "}
              <span className="block xs:inline">and Grow</span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-6 xs:mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-3 xs:px-4 sm:px-0"
            >
              Join the thriving community where Bicol University students share expertise,
              request academic help, and collaborate on meaningful projects. Your skills matter here!
            </motion.p>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col gap-2 xs:gap-3 sm:gap-4 justify-center mb-8 xs:mb-12 sm:mb-16 px-3 xs:px-4 sm:px-0"
            >
              <Link href="/auth/signup" className="w-full xs:w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  leftIcon={<BookOpen className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                  className="text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 font-semibold w-full py-3 xs:py-4"
                >
                  <span className="hidden xs:inline">Share Your Skills</span>
                  <span className="xs:hidden">Share Skills</span>
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full xs:w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-picton-blue hover:bg-gray-50 text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 font-semibold w-full py-3 xs:py-4"
                  leftIcon={<Lightbulb className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                >
                  <span className="hidden xs:inline">Get Help Now</span>
                  <span className="xs:hidden">Get Help</span>
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 lg:gap-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm md:text-base leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 xs:py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 xs:mb-12 sm:mb-16">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl xs:text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-3 xs:mb-4 px-2 xs:px-0"
            >
              Everything you need to collaborate
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-3 xs:px-4 sm:px-0 leading-relaxed"
            >
              Discover powerful features designed to help BU students connect, collaborate,
              and grow together in a trusted academic environment.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full p-4 xs:p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border-0 shadow-lg dark:shadow-gray-900/10 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <CardContent className="p-0">
                    <div className={`w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-6`}>
                      <feature.icon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-base xs:text-lg sm:text-xl font-heading font-semibold mb-2 xs:mb-3 text-gray-900 dark:text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="py-12 xs:py-16 sm:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 xs:mb-12 sm:mb-16">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-2xl xs:text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-3 xs:mb-4 px-2 xs:px-0"
              >
                Comprehensive platform for student success
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-300 px-3 xs:px-4 sm:px-0"
              >
                From skill sharing to help requests, we&apos;ve built everything you need
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 xs:gap-8 sm:gap-12 items-center">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4 xs:space-y-6 sm:space-y-8">
                  <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 xs:mb-2">Skills Marketplace</h3>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Browse and discover skills offered by fellow BU students. Search by category, filter by expertise level, and connect instantly.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 xs:mb-2">Help Request System</h3>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Need assistance? Create detailed help requests and get matched with students who have the expertise you need.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 xs:space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 xs:mb-2">Profile Management</h3>
                      <p className="text-xs xs:text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Comprehensive user profiles with skills tracking, collaboration history, and reputation building through peer reviews.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-picton-blue to-sandy-brown rounded-2xl p-4 xs:p-6 sm:p-8 text-white shadow-2xl">
                  <div className="space-y-4 xs:space-y-6">
                    <div className="flex items-center space-x-2 xs:space-x-3">
                      <div className="w-8 h-8 xs:w-10 xs:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Handshake className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span className="font-bold text-base xs:text-lg sm:text-xl">BU Connect Dashboard</span>
                    </div>
                    <div className="space-y-3 xs:space-y-4">
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 xs:p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs xs:text-sm opacity-90">Your Active Skills</span>
                          <span className="font-bold text-sm xs:text-base">12</span>
                        </div>
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 xs:p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs xs:text-sm opacity-90">Help Requests</span>
                          <span className="font-bold text-sm xs:text-base">3 pending</span>
                        </div>
                      </div>
                      <div className="bg-white/10 dark:bg-white/5 rounded-lg p-3 xs:p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs xs:text-sm opacity-90">Trust Score</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 xs:w-4 xs:h-4 fill-current" />
                            <span className="font-bold text-sm xs:text-base">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 xs:pt-4">
                      <Button
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/20 dark:bg-white/10 dark:hover:bg-white/20 text-xs xs:text-sm w-full xs:w-auto"
                      >
                        <span className="hidden xs:inline">Try Demo Account →</span>
                        <span className="xs:hidden">Demo →</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 xs:py-16 sm:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-3 xs:px-4">
          <div className="text-center mb-8 xs:mb-12 sm:mb-16">
            <motion.h2
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-2xl xs:text-3xl sm:text-4xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-3 xs:mb-4 px-2 xs:px-0"
            >
              Loved by BUeños everywhere
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm xs:text-base sm:text-lg text-gray-600 dark:text-gray-300 px-3 xs:px-4"
            >
              See what our community members have to say about BU Connect
            </motion.p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-6 sm:p-8 lg:p-12 text-center shadow-xl border-0 dark:bg-gray-800 dark:shadow-gray-900/10">
                  <CardContent className="p-0">
                    <div className="flex justify-center mb-4 sm:mb-6">
                      {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-lg sm:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed italic px-2 sm:px-0">
                      &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-picton-blue to-sandy-brown rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                        {testimonials[currentTestimonial].avatar}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                          {testimonials[currentTestimonial].role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center space-x-1.5 sm:space-x-2 mt-6 sm:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                      ? "bg-picton-blue scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-picton-blue to-sandy-brown">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 sm:mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto px-4 sm:px-0">
              Join thousands of BU students who are already collaborating and growing together.
              Your next great project partner is waiting!
            </p>
            <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 justify-center px-3 xs:px-4 sm:px-0">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-white text-picton-blue hover:bg-gray-50 text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 w-full py-3 xs:py-4"
                  rightIcon={<ArrowRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />}
                >
                  <span className="hidden xs:inline">Join BU Connect</span>
                  <span className="xs:hidden">Join Now</span>
                </Button>
              </Link>
              <Link href="/auth/signin" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="text-white border-white hover:bg-white/10 text-sm xs:text-base sm:text-lg px-6 xs:px-8 sm:px-10 w-full py-3 xs:py-4"
                >
                  <span className="hidden xs:inline">Already a member?</span>
                  <span className="xs:hidden">Sign In</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-6 xs:py-8 sm:py-12">
        <div className="container mx-auto px-3 xs:px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8 mb-4 xs:mb-6 sm:mb-8">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 mb-2 xs:mb-3 sm:mb-4">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-picton-blue to-sandy-brown rounded-lg flex items-center justify-center">
                  <Handshake className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-base xs:text-lg sm:text-xl">BU Connect</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 mb-2 xs:mb-3 sm:mb-4 max-w-md text-xs xs:text-sm sm:text-base leading-relaxed">
                Connecting Bicol University students for collaboration, learning, and growth.
                Built by BUeños, for BUeños.
              </p>
              <div className="flex items-center space-x-1 xs:space-x-2">
                <Coffee className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-sandy-brown" />
                <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">Made with love and lots of coffee</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base">Platform</h4>
              <ul className="space-y-1 xs:space-y-2 text-gray-400 dark:text-gray-500 text-xs xs:text-sm sm:text-base">
                <li><Link href="/features" className="hover:text-white dark:hover:text-gray-300 transition-colors">Features</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white dark:hover:text-gray-300 transition-colors">How it works</Link></li>
                <li><Link href="/safety" className="hover:text-white dark:hover:text-gray-300 transition-colors">Safety</Link></li>
                <li><Link href="/community" className="hover:text-white dark:hover:text-gray-300 transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base">Support</h4>
              <ul className="space-y-1 xs:space-y-2 text-gray-400 dark:text-gray-500 text-xs xs:text-sm sm:text-base">
                <li><Link href="/help" className="hover:text-white dark:hover:text-gray-300 transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white dark:hover:text-gray-300 transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white dark:hover:text-gray-300 transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white dark:hover:text-gray-300 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-700 pt-4 xs:pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-3 xs:space-y-4 sm:space-y-0">
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm text-center sm:text-left">
              &copy; 2025 BU Connect. Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 inline text-red-500" /> for Bicol University students.
            </p>
            <div className="flex items-center space-x-2 xs:space-x-3 sm:space-x-4 text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
              <span>🇵🇭 Proudly Filipino</span>
              <span>•</span>
              <span>🎓 For BUeños</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
