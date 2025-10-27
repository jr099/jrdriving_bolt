'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '../lib/api-types';
import { useAuth } from '../contexts/auth-context';
import { getRoleRedirectPath } from '../lib/navigation';

export function RoleGuard({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    if (profile && !roles.includes(profile.role)) {
      router.replace(getRoleRedirectPath(profile.role));
    }
  }, [isLoading, profile, roles, router, user]);

  if (!user || !profile || !roles.includes(profile.role)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement de votre espace...</p>
      </div>
    );
  }

  return <>{children}</>;
}
