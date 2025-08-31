"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    // Simple toggle between light and dark
    if (actualTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const getIcon = () => {
    return actualTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
  };

  const getLabel = () => {
    return actualTheme === 'dark' ? 'Light' : 'Dark';
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative w-9 h-9 p-0"
      title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={actualTheme}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">{getLabel()} mode</span>
    </Button>
  );
}

export function ThemeToggleWithLabel() {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'dark', label: 'Dark', icon: Moon },
    { key: 'system', label: 'System', icon: Monitor },
  ] as const;

  return (
    <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setTheme(key)}
          className={`relative flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${theme === key
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
          {theme === key && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
              style={{ zIndex: -1 }}
              transition={{ type: "spring", duration: 0.3 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
