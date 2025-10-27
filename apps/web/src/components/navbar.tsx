'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Truck, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/auth-context';
import { cn } from '../lib/utils';

type NavItem = {
  name: string;
  href: string;
};

function resolveNavItems(role: string | null): NavItem[] {
  switch (role) {
    case 'admin':
      return [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Administration', href: '/admin' },
        { name: 'Contact', href: '/contact' },
      ];
    case 'driver':
      return [
        { name: 'Accueil', href: '/' },
        { name: 'Mes missions', href: '/chauffeur' },
        { name: 'Contact', href: '/contact' },
      ];
    case 'client':
      return [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Espace client', href: '/client' },
        { name: 'Contact', href: '/contact' },
      ];
    default:
      return [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Contact', href: '/contact' },
      ];
  }
}

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = resolveNavItems(profile?.role ?? null);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Truck className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-xl font-bold">jrdriving</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors',
                  pathname === item.href ? 'text-orange-500 font-semibold' : 'text-gray-300 hover:text-white'
                )}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-200">
                  <User className="h-5 w-5" />
                  <span>{profile?.fullName}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="text-gray-300 hover:text-white">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block w-full text-left px-4 py-2 rounded-lg transition-colors',
                  pathname === item.href ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-slate-700'
                )}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <div className="space-y-3 pt-3 border-t border-slate-700">
                <div className="px-4 text-sm text-gray-300 flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{profile?.fullName}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
