# Štruktúra Projektu

Projekt má logickú a škálovateľnú štruktúru, ktorá oddeľuje jednotlivé časti aplikácie podľa ich funkcie. Využíva sa Next.js App Router.

- **`/app`**: Jadro aplikácie, kde je definované routovanie a jednotlivé stránky.
  - **`/(main)`**: Skupina pre hlavné, verejne prístupné stránky (Domov, O nás, E-shop, Kontakt, atď.).
  - **`/admin`**: Zabezpečená sekcia pre administrátorov. Umožňuje správu produktov, objednávok a ďalších častí webu.
  - **`/api`**: Serverové API trasy. Primárne slúži na spracovanie webhookov od externých služieb ako Stripe.
    - `POST /api/checkout`: Webhook, ktorý spracuje úspešnú platbu a vytvorí objednávku v databáze.
  - **`/auth`**: Stránky a logika pre autentifikáciu používateľov – prihlásenie, registrácia, obnova hesla.
  - **`layout.tsx`**: Hlavný layout aplikácie, ktorý obaľuje všetky stránky. Definuje základnú HTML štruktúru, načítava globálne štýly a fonty.
  - **`globals.css`**: Globálne CSS štýly a definície pre Tailwind CSS.

- **`/components`**: Znovu použiteľné React komponenty, ktoré tvoria používateľské rozhranie.
  - **`/ui`**: Základné UI prvky (atómy) generované knižnicou Shadcn/UI (napr. `Button.tsx`, `Input.tsx`, `Card.tsx`).
  - **`/layout`**: Komponenty pre štruktúru stránky, ako `Header.tsx`, `Footer.tsx` a `MobileNav.tsx`.
  - **Ostatné**: Špecifické, komplexnejšie komponenty (`ProductCard.tsx`, `LoginForm.tsx`, `CartButton.tsx`).

- **`/lib`**: Pomocné funkcie, konfigurácie a logika pre komunikáciu s externými službami.
  - **`supabase/`**: Obsahuje klientov (`client.ts`, `server.ts`) pre interakciu so Supabase z klientskej a serverovej strany.
  - **`stripe.ts`**: Inštancia a konfigurácia Stripe klienta pre prácu s platbami.
  - **`types.ts`**: TypeScript typové definície používané naprieč projektom.
  - **`utils.ts`**: Všeobecné pomocné funkcie (napr. formátovanie meny, generovanie URL).

- **`/emails`**: React komponenty, ktoré slúžia ako e-mailové šablóny. Tieto šablóny sú renderované a odosielané pomocou služby Resend.

- **`/public`**: Adresár pre statické súbory, ako sú obrázky (`/images`), ikony a fonty, ktoré sú verejne prístupné.

- **Konfiguračné súbory (root)**:
  - `next.config.mjs`: Konfigurácia pre Next.js.
  - `tailwind.config.ts`: Konfigurácia pre Tailwind CSS, vrátane definície farieb, fontov a ďalších dizajnových tokenov.
  - `middleware.ts`: Next.js middleware, ktorý sa spúšťa pred spracovaním požiadavky. Využíva sa na ochranu trás a správu používateľských relácií.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

Projekt bude organizovaný podľa štandardov moderných Next.js aplikácií s dôrazom na prehľadnosť a modularitu.

```bash
putec-eshop/
├── /app/                           # Jadro aplikácie (App Router)
│   ├── /api/                       # Backend API routes
│   │   └── /stripe/                # Webhook pre Stripe
│   │       └── route.ts
│   ├── /(pages)/                   # Skupina pre hlavné stránky (bez vplyvu na URL)
│   │   ├── /vino/                  # Zoznam vín
│   │   │   ├── /[slug]/            # Dynamická stránka pre detail vína
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── /prislusenstvo/
│   │   │   └── page.tsx
│   │   ├── /zazitky/
│   │   │   ├── /[slug]/            # Detail zážitku
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── /ubytovanie/
│   │   │   └── page.tsx
│   │   ├── /kosik/
│   │   │   └── page.tsx
│   │   ├── /pokladna/
│   │   │   └── page.tsx
│   │   └── /objednavka/
│   │       └── /[id]/              # Potvrdenie objednávky
│   │           └── page.tsx
│   ├── /auth/                      # Autentifikačné stránky (Supabase Auth UI alebo vlastné)
│   ├── layout.tsx                  # Hlavný koreňový layout
│   ├── page.tsx                    # Úvodná stránka (Homepage)
│   └── globals.css                 # Globálne CSS štýly
│
├── /components/                    # Zdieľané React komponenty
│   ├── /ui/                        # Atomické UI komponenty (Button, Input, Card)
│   ├── /products/                  # Komponenty súvisiace s produktmi
│   ├── /experiences/               # Komponenty pre zážitky
│   └── /checkout/                  # Komponenty pre nákupný proces
│
├── /lib/                           # Pomocné funkcie, klienti a utility
│   ├── supabase/                   # Konfigurácia Supabase klientov (server, client)
│   │   ├── client.ts
│   │   └── server.ts
│   ├── stripe.ts                   # Konfigurácia Stripe klienta
│   ├── resend.ts                   # Konfigurácia Resend klienta
│   └── utils.ts                    # Všeobecné pomocné funkcie (napr. formátovanie ceny)
│
├── /public/                        # Statické súbory
│   ├── /images/                    # Obrázky, logá
│   └── /icons/                     # Ikony, favicon
│
├── /styles/                        # Prípadné ďalšie globálne štýly (ak by nestačil globals.css)
│
├── .env.local                      # Lokálne environmentálne premenné (API kľúče)
├── next.config.mjs                 # Konfigurácia Next.js
├── tailwind.config.ts              # Konfigurácia Tailwind CSS
├── tsconfig.json                   # Konfigurácia TypeScriptu
└── package.json                    # Zoznam závislostí a skriptov
```

### Popis Kľúčových Priečinkov

- **/app**: Definuje všetky routy a stránky aplikácie. Využíva App Router paradigmu z Next.js. Vnorené priečinky zodpovedajú URL segmentom.
- **/components**: Obsahuje znovupoužiteľné UI komponenty. Sú rozdelené podľa domény (produkty, checkout), čo uľahčuje orientáciu.
- **/lib**: Knižnica pre logiku, ktorá nie je priamo viazaná na UI. Sem patrí inicializácia externých služieb (Supabase, Stripe) a ďalšie pomocné funkcie.
- **/public**: Miesto pre statické aktíva, ktoré sú priamo prístupné cez URL (napr. `example.com/images/logo.png`).
