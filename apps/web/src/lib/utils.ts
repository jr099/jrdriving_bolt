import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function normalizeBaseUrl(url: string) {
  const trimmed = url.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.trim()?.length
  ? normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL)
  : 'http://localhost:4000/api';
