# Štruktúra Projektu

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
