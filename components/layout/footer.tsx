import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
        <div>
          <h3 className="text-lg font-bold">Pútec</h3>
          <p className="text-muted-foreground mt-2">Vinárstvo s tradíciou, chuťou a srdcom.</p>
        </div>
        <div>
          <h4 className="font-semibold">Rýchle odkazy</h4>
          <ul className="mt-2 space-y-1">
            <li><Link href="/vino" className="text-muted-foreground hover:text-foreground">Všetky vína</Link></li>
            <li><Link href="/zazitky" className="text-muted-foreground hover:text-foreground">Degustácie</Link></li>
            <li><Link href="/ubytovanie" className="text-muted-foreground hover:text-foreground">Ubytovanie</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Právne informácie</h4>
          <ul className="mt-2 space-y-1">
            <li><Link href="/obchodne-podmienky" className="text-muted-foreground hover:text-foreground">Obchodné podmienky</Link></li>
            <li><Link href="/ochrana-osobnych-udajov" className="text-muted-foreground hover:text-foreground">Ochrana osobných údajov</Link></li>
            <li><Link href="/kontakt" className="text-muted-foreground hover:text-foreground">Kontakt</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Pútec. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  );
};
