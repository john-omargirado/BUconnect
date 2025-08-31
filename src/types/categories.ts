// Valid categories that match the Prisma schema
export const VALID_CATEGORIES = [
  'ACADEMICS',
  'DESIGN', 
  'TECH',
  'WRITING',
  'TUTORING',
  'CREATIVE',
  'RESEARCH',
  'SPORTS',
  'LANGUAGE',
  'MUSIC',
  'OTHER'
] as const;

export type Category = typeof VALID_CATEGORIES[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  ACADEMICS: 'Academic Subjects',
  DESIGN: 'Design & Graphics',
  TECH: 'Technology',
  WRITING: 'Writing & Editing',
  TUTORING: 'Tutoring',
  CREATIVE: 'Creative Arts',
  RESEARCH: 'Research',
  SPORTS: 'Sports & Fitness',
  LANGUAGE: 'Language',
  MUSIC: 'Music',
  OTHER: 'Other'
};

export const CATEGORY_COLORS = {
  ACADEMICS: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  TECH: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
  CREATIVE: "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
  SPORTS: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  LANGUAGE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  MUSIC: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
  DESIGN: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
  WRITING: "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300",
  TUTORING: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
  RESEARCH: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300",
  OTHER: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
};
