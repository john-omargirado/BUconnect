import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme utility functions
export const themeClasses = {
  // Background variants
  background: {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground", 
    muted: "bg-muted text-muted-foreground",
    card: "bg-card text-card-foreground",
    accent: "bg-accent text-accent-foreground",
  },
  
  // Text variants
  text: {
    primary: "text-primary",
    secondary: "text-secondary", 
    muted: "text-muted-foreground",
    foreground: "text-foreground",
    accent: "text-accent-foreground",
  },
  
  // Border variants
  border: {
    default: "border-border",
    input: "border-input",
    muted: "border-muted",
  },
  
  // Interactive states
  hover: {
    accent: "hover:bg-accent hover:text-accent-foreground",
    muted: "hover:bg-muted hover:text-muted-foreground",
    destructive: "hover:bg-destructive/10 hover:text-destructive",
  },
  
  // Gradient backgrounds
  gradient: {
    primary: "bg-gradient-to-r from-primary to-primary/80",
    secondary: "bg-gradient-to-r from-secondary to-secondary/80",
    accent: "bg-gradient-to-r from-primary via-primary to-secondary",
  },
};

// Dark mode compatible icon backgrounds
export const iconBackgrounds = {
  blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  green: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
  yellow: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  red: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  teal: "bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400",
  pink: "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
};

// Status colors
export const statusColors = {
  success: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
  warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20",
  error: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20",
  info: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
};

// Animation utilities
export const animations = {
  fadeInUp: "animate-fade-in-up",
  float: "animate-float",
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
};

// Responsive utilities
export const responsive = {
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  grid: {
    cols1: "grid grid-cols-1",
    cols2: "grid grid-cols-1 md:grid-cols-2",
    cols3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  },
  spacing: {
    section: "py-16 lg:py-24",
    card: "p-6 lg:p-8",
    button: "px-4 py-2 lg:px-6 lg:py-3",
  },
};

// Theme-aware shadows
export const shadows = {
  sm: "shadow-sm dark:shadow-gray-900/20",
  md: "shadow-md dark:shadow-gray-900/30", 
  lg: "shadow-lg dark:shadow-gray-900/40",
  xl: "shadow-xl dark:shadow-gray-900/50",
  glow: "shadow-glow dark:shadow-primary/20",
};
