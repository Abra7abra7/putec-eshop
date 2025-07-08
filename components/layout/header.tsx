import Link from 'next/link';
import Image from 'next/image';
import { AuthButton } from '@/components/auth-button';
import { CartButton } from './cart-button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/images/logoputec.svg" alt="Vinárstvo Pútec Logo" width={140} height={35} className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link href="/o-nas" className="transition-colors hover:text-primary">O nás</Link>
          <Link href="/vino" className="transition-colors hover:text-primary">E-shop</Link>
          <Link href="/degustacie" className="transition-colors hover:text-primary">Degustácie</Link>
          <Link href="/ubytovanie" className="transition-colors hover:text-primary">Ubytovanie</Link>
          <Link href="/kontakt" className="transition-colors hover:text-primary">Kontakt</Link>
        </nav>
        <div className="flex items-center gap-2">
          <CartButton />
          <AuthButton />
        </div>
      </div>
    </header>
  );
};
