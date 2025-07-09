import Link from "next/link";
import Image from 'next/image';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-card/50">
      <div className="container max-w-screen-2xl grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-4 md:px-6">
        
        {/* Column 1: Brand & Contact */}
        <div className="md:col-span-2">
          <Link href="/">
            <Image src="/images/logoputec.svg" alt="Vinárstvo Pútec Logo" width={160} height={40} className="h-10 w-auto" />
          </Link>
          <p className="text-muted-foreground mt-2 mb-4">Vinárstvo s tradíciou, chuťou a srdcom.</p>
          <div className="space-y-2 text-muted-foreground">
            <p className="flex items-center"><MapPin className="h-4 w-4 mr-2 shrink-0"/> Vinohradnícka 123, 902 01 Pezinok</p>
            <a href="mailto:rezervacie@putec.sk" className="flex items-center hover:text-primary transition-colors"><Mail className="h-4 w-4 mr-2 shrink-0"/> rezervacie@putec.sk</a>
            <a href="tel:+4219XXYYYZZZ" className="flex items-center hover:text-primary transition-colors"><Phone className="h-4 w-4 mr-2 shrink-0"/> +421 9XX YYY ZZZ</a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h4 className="font-semibold">Navigácia</h4>
          <ul className="mt-2 space-y-1">
            <li><Link href="/o-nas" className="text-muted-foreground transition-colors hover:text-primary">O nás</Link></li>
            <li><Link href="/vino" className="text-muted-foreground transition-colors hover:text-primary">E-shop</Link></li>
            <li><Link href="/degustacie" className="text-muted-foreground transition-colors hover:text-primary">Degustácie</Link></li>
            <li><Link href="/ubytovanie" className="text-muted-foreground transition-colors hover:text-primary">Ubytovanie</Link></li>
            <li><Link href="/kontakt" className="text-muted-foreground transition-colors hover:text-primary">Kontakt</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal & Social */}
        <div>
          <h4 className="font-semibold">Informácie</h4>
          <ul className="mt-2 space-y-1">
            <li><Link href="/obchodne-podmienky" className="text-muted-foreground transition-colors hover:text-primary">Obchodné podmienky</Link></li>
            <li><Link href="/ochrana-osobnych-udajov" className="text-muted-foreground transition-colors hover:text-primary">Ochrana osobných údajov</Link></li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook /></Link>
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram /></Link>
          </div>
        </div>

      </div>
      <div className="border-t">
        <div className="container max-w-screen-2xl py-4 text-center text-sm text-muted-foreground px-4 md:px-6">
            <p>&copy; {new Date().getFullYear()} Pútec. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
};
