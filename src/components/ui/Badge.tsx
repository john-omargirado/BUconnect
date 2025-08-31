"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
        primary: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",
        success: "border-transparent bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30",
        warning: "border-transparent bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30",
        danger: "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border border-border text-foreground hover:bg-accent",
        // Category specific variants with dark mode support
        academics: "border-transparent bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30",
        design: "border-transparent bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/30",
        tech: "border-transparent bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30",
        writing: "border-transparent bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30",
        tutoring: "border-transparent bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/30",
        creative: "border-transparent bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-900/30",
        research: "border-transparent bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/30",
        other: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
