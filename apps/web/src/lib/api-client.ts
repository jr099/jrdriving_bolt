'use client';

import axios from 'axios';
import { API_BASE_URL } from './utils';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as Record<string, unknown>).message;
      if (typeof message === 'string') {
        return message;
      }
    }
    return error.message ?? 'Une erreur est survenue';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Une erreur est survenue';
}
