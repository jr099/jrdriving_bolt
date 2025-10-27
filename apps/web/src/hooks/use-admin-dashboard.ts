'use client';

import useSWR from 'swr';
import { fetchAdminDashboard } from '../lib/api';
import type { AdminDashboardPayload } from '../lib/api-types';

type Options = {
  enabled?: boolean;
};

export function useAdminDashboard(options: Options = {}) {
  const shouldFetch = options.enabled ?? true;
  const swr = useSWR<AdminDashboardPayload>(shouldFetch ? 'admin-dashboard' : null, () => fetchAdminDashboard(), {
    revalidateOnFocus: true,
  });

  return {
    data: swr.data,
    error: swr.error,
    isLoading: swr.isLoading,
    isValidating: swr.isValidating,
    refresh: () => swr.mutate(),
  };
}
