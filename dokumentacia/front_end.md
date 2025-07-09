# Front-end Architektúra

Front-end je postavený na moderných technológiách s cieľom dosiahnuť vysoký výkon, dobrú používateľskú skúsenosť (UX) a jednoduchú údržbu kódu.

## Kľúčové technológie

- **[Next.js](https://nextjs.org) (App Router):** Framework postavený na Reacte, ktorý umožňuje hybridné renderovanie (serverové aj klientske). App Router zjednodušuje routovanie a umožňuje lepšiu organizáciu kódu.
- **[React](https://react.dev/):** Knižnica pre tvorbu používateľských rozhraní.
- **[Tailwind CSS](https://tailwindcss.com):** Utility-first CSS framework pre rýchly a konzistentný dizajn.
- **[Shadcn/UI](https://ui.shadcn.com/):** Kolekcia znovu použiteľných UI komponentov postavených na Tailwind CSS, ktoré slúžia ako základ pre dizajn systému.

## Komponentový model: Server vs. Client Components

Projekt plne využíva hybridný model renderovania, ktorý ponúka Next.js App Router.

### Server Components (predvolené)

- **Použitie:** Väčšina komponentov je serverových. Renderujú sa na serveri, čo znižuje množstvo JavaScriptu posielaného do prehliadača a zrýchľuje prvé načítanie stránky (FCP).
- **Výhody:**
  - Priamy prístup k backendovým zdrojom (napr. databáza cez serverového Supabase klienta).
  - Zvýšená bezpečnosť, pretože citlivá logika a kľúče zostávajú na serveri.
  - Lepšie SEO.
- **Príklady:** Komponenty, ktoré načítavajú dáta a nepotrebujú interaktivitu (`ProductList`, `ProductDetail`).

### Client Components (`'use client'`)

- **Použitie:** Komponenty, ktoré vyžadujú interaktivitu na strane klienta (používajú hooky ako `useState`, `useEffect` alebo event listenery ako `onClick`).
- **Označenie:** Na začiatku súboru musia byť označené direktívou `'use client'`.
- **Výhody:** Umožňujú dynamické a interaktívne používateľské rozhranie.
- **Príklady:** `AddToCartButton`, `MobileNav`, formuláre, `ThemeSwitcher`.

## Štruktúra Komponentov

Adresár `/components` je organizovaný nasledovne:

- **`/ui`**: Obsahuje základné, tzv. "atómové" komponenty z knižnice Shadcn/UI (`Button`, `Input`, `Card`, `Dialog`). Tieto komponenty sú stavebné kamene pre zložitejšie prvky.
- **`/layout`**: Definuje hlavné časti rozloženia stránky, ako sú `Header`, `Footer` a `MobileNav`.
- **Ostatné komponenty**: Sú umiestnené priamo v `/components` a predstavujú špecifické funkčné celky, napríklad `ProductCard`, `LoginForm`, `CheckoutForm`.

## Formuláre

Spracovanie formulárov (prihlásenie, registrácia, pokladňa) je riešené kombináciou:

- **React Hook Form:** Pre správu stavu formulárov.
- **Zod:** Pre validáciu dát na strane klienta aj servera.
- **Formuláre a Server Actions:** Pre interakcie ako pridanie do košíka, registrácia alebo odoslanie dopytu na zážitok sa využívajú Server Actions. Formuláre sú validované pomocou knižníc `react-hook-form` a `zod`, čo zaručuje bezpečnosť a dobrú používateľskú skúsenosť.
- **Zobrazenie zážitkov a dopyty:** Pribudli nové komponenty určené na zobrazenie ponuky zážitkov (degustácie, ubytovanie) a formulár, prostredníctvom ktorého môžu zákazníci posielať nezáväzné dopyty.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

## 1. Technologický Stack

- **Framework:** **Next.js 15+**
  - Využijeme **App Router** pre modernú štruktúru, server-side rendering (SSR) a statickú generáciu stránok (SSG), čo zabezpečí rýchle načítanie a výborné SEO.
  - Serverové komponenty budú použité pre získavanie dát a logiku, zatiaľ čo klientske komponenty (`"use client"`) pre interaktivitu.

- **Knižnica:** **React 19+**
  - Základ pre budovanie používateľského rozhrania.

- **Styling:** **Tailwind CSS**
  - Utility-first prístup pre rýchly vývoj responzívneho dizajnu priamo v JSX.
  - Využijeme `tailwind.config.ts` na definovanie vlastnej farebnej palety a typografie podľa dizajn manuálu.

- **Správa stavu (State Management):**
  - **React Hooks (`useState`, `useContext`, `useReducer`):** Pre lokálny a jednoduchý globálny stav (napr. stav otvoreného menu).
  - **`localStorage`:** Pre perzistentný stav nákupného košíka na strane klienta. Košík tak zostane zachovaný aj po zatvorení prehliadača.
  - Pre zložitejšie globálne stavy (ak by boli potrebné) zvážime knižnice ako **Zustand** alebo **Jotai** pre ich jednoduchosť.

## 2. Štruktúra Priečinkov (Komponenty)

```
/components
  /ui               # Základné, znovu použiteľné UI prvky (Button, Input, Card, Label...)
  /products         # Komponenty špecifické pre produkty
    - ProductCard.tsx     # Karta produktu pre zoznamy
    - ProductList.tsx     # Zoznam produktov s filtrovaním a triedením
    - ProductDetails.tsx  # Kompletný detail produktu
    - ProductGallery.tsx  # Galéria obrázkov
  /experiences      # Komponenty pre zážitky
    - ExperienceCard.tsx  # Karta zážitku
    - InquiryForm.tsx     # Dopytový formulár
  /checkout         # Komponenty pre nákupný proces
    - CartView.tsx        # Zobrazenie obsahu košíka
    - CheckoutForm.tsx    # Formulár pre zhrnutie objednávky
  /layout           # Komponenty pre hlavný layout
    - Header.tsx
    - Footer.tsx
    - Navbar.tsx
  /auth             # Komponenty pre autentifikáciu (ak budú custom)
    - LoginForm.tsx
```

## 3. Kľúčové Funkcionality a Stránky

- **Nákupný košík (`/kosik`):**
  - Plne klientsky orientovaný. Používatelia môžu pridávať, odoberať a meniť počet produktov.
  - Stav je uložený v `localStorage`, synchronizovaný pomocou React Context alebo Zustand.

- **Pokladňa (`/pokladna`):**
  - Jednostránkový formulár pre maximálnu konverziu.
  - Prepínač medzi nákupom na **fyzickú osobu** a **firmu** (dynamicky zobrazí/skryje polia ako IČO, DIČ).
  - Validácia formulára v reálnom čase.

- **Detail produktu (`/vino/[slug]`):**
  - Generovaná serverovo (SSR/SSG) pre rýchlosť a SEO.
  - Interaktívne prvky (pridanie do košíka, galéria) budú klientske komponenty.

- **Detail zážitku (`/zazitky/[slug]`):**
  - Obsahuje dopytový formulár (`InquiryForm.tsx`), ktorý odosiela dáta na serverovú akciu (Server Action) alebo API endpoint.

- **Ubytovanie (`/ubytovanie`):**
  - Jednoduchá stránka s vloženým **iFrame** z rezervačného systému Bookio.
