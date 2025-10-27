'use client';

import Link from 'next/link';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Truck className="h-8 w-8 text-orange-500" />
              <span className="ml-2 text-xl font-bold text-white">jrdriving</span>
            </Link>
            <p className="text-sm">
              Votre partenaire logistique pour le transport rapide et sécurisé de vos véhicules.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-orange-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/devis" className="hover:text-orange-500 transition-colors">
                  Demander un devis
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-orange-500 transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/conditions-generales" className="hover:text-orange-500 transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-orange-500 transition-colors">
                  RGPD
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                <a href="mailto:contact@jrdriving.galaxjr.digital" className="hover:text-orange-500 transition-colors">
                  contact@jrdriving.galaxjr.digital
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-orange-500" />
                <a href="tel:+33123456789" className="hover:text-orange-500 transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-orange-500 mt-0.5" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} jrdriving - Galaxj Air Digital. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
