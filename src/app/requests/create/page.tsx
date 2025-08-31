"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  HelpCircle,
  Tag,
  FileText,
  Mail,
  AlertCircle,
  CheckCircle,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

const CATEGORIES = [
  { value: "ACADEMICS", label: "Academic Help" },
  { value: "TECH", label: "Technology" },
  { value: "CREATIVE", label: "Creative Arts" },
  { value: "SPORTS", label: "Sports & Fitness" },
  { value: "LANGUAGE", label: "Language" },
  { value: "MUSIC", label: "Music" },
  { value: "OTHER", label: "Other" }
];

interface FormData {
  title: string;
  description: string;
  category: string;
  contactInfo: string;
}

export default function CreateRequestPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    contactInfo: ""
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/requests");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create help request");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Card className="p-8 max-w-md mx-auto shadow-xl border-0 bg-card/90 backdrop-blur-sm">
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Help Request Created!
              </h2>
              <p className="text-muted-foreground mb-4">
                Your request has been posted and fellow students can now offer their help.
              </p>
              <Button
                onClick={() => router.push("/requests")}
                className="bg-gradient-to-r from-secondary to-secondary/80"
              >
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <Button
            variant="outline"
            onClick={() => router.push("/requests")}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Request Help
            </h1>
            <p className="text-muted-foreground mt-1">
              Ask for help from your fellow BU students
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-secondary" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                  </motion.div>
                )}

                {/* Title */}
                <div>
                  <Input
                    label="What do you need help with?"
                    leftIcon={<Tag className="w-4 h-4" />}
                    placeholder="e.g., Need help with Calculus homework, Learn Python programming"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe what specific help you need, your current level, any deadlines..."
                      required
                      rows={4}
                      className="w-full pl-10 pr-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none bg-background text-foreground"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Be specific about what kind of help you need and your current understanding
                  </p>
                </div>

                {/* Contact Info */}
                <div>
                  <Input
                    label="Contact Information"
                    leftIcon={<Mail className="w-4 h-4" />}
                    placeholder="Email or phone number"
                    value={formData.contactInfo}
                    onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional: Provide email or phone for helpers to contact you
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/requests")}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Request Help
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-md bg-gradient-to-r from-secondary/5 to-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">
                💡 Tips for getting great help:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  Be specific about what you're struggling with and what you already know
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  Mention any deadlines or urgency level for your request
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  Include your preferred learning style (visual, hands-on, etc.)
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2">•</span>
                  Be open to different teaching approaches and be respectful of helpers' time
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
