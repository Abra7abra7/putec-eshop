'use client';

import { useState, Children, cloneElement, isValidElement } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  navLinks: NavLink[];
  children: React.ReactNode;
}

export const MobileNav = ({ navLinks, children }: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const childrenArray = Children.toArray(children);
  const authButton = childrenArray[0];
  const cartButton = childrenArray[1];

  return (
    <>
      {cartButton}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-primary hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        aria-expanded={isMenuOpen}
      >
        <span className="sr-only">Otvoriť hlavné menu</span>
        {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
      </button>

      {isMenuOpen && (
        <div
          className="absolute left-0 top-full flex w-full flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
          id="mobile-menu"
        >
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-border/40 pb-3 pt-4">
            <div className="flex items-center justify-center px-4">
              {authButton}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
