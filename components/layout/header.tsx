import Link from "next/link";
import { AuthButton } from "@/components/auth-button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Pútec
        </Link>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          <Link href="/vino" className="transition-colors hover:text-foreground/80 text-foreground/60">Vína</Link>
          <Link href="/prislusenstvo" className="transition-colors hover:text-foreground/80 text-foreground/60">Príslušenstvo</Link>
          <Link href="/zazitky" className="transition-colors hover:text-foreground/80 text-foreground/60">Zážitky</Link>
          <Link href="/ubytovanie" className="transition-colors hover:text-foreground/80 text-foreground/60">Ubytovanie</Link>
        </nav>
        <div className="flex items-center gap-4">
            <Link href="/kosik" className="transition-colors hover:text-foreground/80 text-foreground/60">Košík</Link>
            <AuthButton />
        </div>
      </div>
    </header>
  );
};
