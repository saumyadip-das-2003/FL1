import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { projects, type ProjectCategory } from "@/lib/data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProjectsByCategory(category?: ProjectCategory) {
  if (!category) {
    return projects;
  }

  return projects.filter((project) => project.category === category);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
