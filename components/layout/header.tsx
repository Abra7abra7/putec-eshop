import Link from 'next/link';
import { AuthButton } from '@/components/auth-button';
import { CartButton } from './cart-button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Pútec
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link href="/vino" className="transition-colors hover:text-foreground/80">E-shop</Link>
          <Link href="/zazitky" className="transition-colors hover:text-foreground/80">Degustácie</Link>
          <Link href="/ubytovanie" className="transition-colors hover:text-foreground/80">Ubytovanie</Link>
        </nav>
        <div className="flex items-center gap-2">
          <CartButton />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
