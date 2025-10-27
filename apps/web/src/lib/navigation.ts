import type { Profile } from './api-types';

export type AppPage =
  | 'home'
  | 'services'
  | 'quote'
  | 'contact'
  | 'login'
  | 'client'
  | 'driver'
  | 'admin'
  | 'legal'
  | 'terms'
  | 'privacy';

export const PAGE_TO_PATH: Record<AppPage, string> = {
  home: '/',
  services: '/services',
  quote: '/devis',
  contact: '/contact',
  login: '/login',
  client: '/client',
  driver: '/chauffeur',
  admin: '/admin',
  legal: '/mentions-legales',
  terms: '/conditions-generales',
  privacy: '/politique-confidentialite',
};

export function getRoleDefaultPage(role: Profile['role']): AppPage {
  switch (role) {
    case 'admin':
      return 'admin';
    case 'driver':
      return 'driver';
    case 'client':
    default:
      return 'client';
  }
}

export function getRoleRedirectPath(role: Profile['role']): string {
  return PAGE_TO_PATH[getRoleDefaultPage(role)];
}
