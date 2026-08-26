import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dancingsalamanders.com";

export function getAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
