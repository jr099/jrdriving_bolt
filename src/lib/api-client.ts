import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL?.trim()
  ? import.meta.env.VITE_API_URL
  : '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data &&
        typeof (error.response.data as any).message === 'string'
        ? (error.response.data as any).message
        : undefined) ?? error.message ?? 'Une erreur est survenue'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Une erreur est survenue';
}
