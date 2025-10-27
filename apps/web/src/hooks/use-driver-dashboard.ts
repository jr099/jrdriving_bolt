'use client';

import useSWR from 'swr';
import { fetchDriverDashboard } from '../lib/api';
import type { DriverDashboardPayload } from '../lib/api-types';

type Options = {
  enabled?: boolean;
};

export function useDriverDashboard(options: Options = {}) {
  const shouldFetch = options.enabled ?? true;
  const swr = useSWR<DriverDashboardPayload>(shouldFetch ? 'driver-dashboard' : null, () => fetchDriverDashboard(), {
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
