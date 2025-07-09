import Link from 'next/link';
import Image from 'next/image';
import { AuthButton } from '@/components/auth-button';
import { CartButton } from './cart-button';
import { MobileNav } from './mobile-nav';

const navLinks = [
  { href: '/o-nas', label: 'O nás' },
  { href: '/vino', label: 'E-shop' },
  { href: '/degustacie', label: 'Degustácie' },
  { href: '/ubytovanie', label: 'Ubytovanie' },
  { href: '/kontakt', label: 'Kontakt' },
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image src="/images/logoputec.svg" alt="Vinárstvo Pútec Logo" width={140} height={35} className="h-9 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-2 md:flex">
          <CartButton />
          <AuthButton />
        </div>

        {/* Mobile Navigation Wrapper */}
        <div className="flex items-center md:hidden">
          <MobileNav navLinks={navLinks}>
            <AuthButton />
            <CartButton />
          </MobileNav>
        </div>
      </div>
    </header>
  );
};
