# Dokumentácia Projektu: Pútec E-shop

**Dátum a čas poslednej aktualizácie:** 8. júl 2024, 10:11

## 1. Úvod a Prehľad Projektu

Tento dokument poskytuje komplexný prehľad o architektúre, technológiách a funkcionalite moderného e-shopu pre vinárstvo Pútec. Projekt je postavený na platforme Next.js a využíva Supabase pre backendové služby a autentifikáciu.

### Kľúčové Technológie

- **Framework:** Next.js 15 (s App Routerom a Turbopackom)
- **Jazyk:** TypeScript
- **Backend & Databáza:** Supabase (Auth, PostgreSQL, Storage)
- **UI Komponenty:** shadcn/ui, Tailwind CSS
- **Platobná Brána:** Stripe
- **Verzovanie:** Git & GitHub

---

## 2. Štruktúra Projektu

Projekt využíva **Route Groups** v Next.js na oddelenie logických častí aplikácie a ich rozložení (layouts).

```
/putec-eshop
|-- app/
|   |-- (main)/             # Skupina pre verejné stránky (e-shop, info...)
|   |   |-- page.tsx        # Domovská stránka
|   |   |-- layout.tsx      # Hlavné rozloženie s <Header> a <Footer>
|   |   |-- vino/
|   |   |-- kosik/
|   |   `-- ...             # Ďalšie verejné stránky
|   |
|   |-- admin/              # Skupina pre administrátorskú sekciu
|   |   |-- layout.tsx      # Minimálne rozloženie bez <Header> a <Footer>
|   |   |-- products/       # Správa produktov (CRUD)
|   |   |   |-- page.tsx
|   |   |   |-- _actions/productActions.tsx
|   |   |   `-- _components/product-form.tsx
|   |   `-- ...
|   |
|   |-- auth/               # Skupina pre autentifikáciu
|   |   |-- layout.tsx      # Centrované rozloženie pre formuláre
|   |   |-- login/page.tsx
|   |   `-- ...
|   |
|   |-- api/                # API koncové body (Route Handlers)
|   |   |-- checkout/route.ts
|   |   `-- webhook/route.ts
|   |
|   `-- layout.tsx          # Koreňové rozloženie (<html>, <body>, ThemeProvider)
|
|-- components/
|   |-- ui/                 # Komponenty zo shadcn/ui (Button, Input...)
|   |-- layout/             # Komponenty rozloženia (Header, Footer)
|   `-- login-form.tsx
|
|-- lib/
|   `-- supabase/           # Klienti pre komunikáciu so Supabase
|
|-- middleware.ts           # Middleware pre ochranu trás
|
`-- ...                     # Konfiguračné súbory
```

---

## 3. Autentifikácia a Autorizácia

Systém je postavený na **Supabase Auth**.

### Middleware (`middleware.ts`)

- **Funkcia:** Chráni všetky trasy pod `/admin/*`.
- **Logika:**
  1. Vytvorí Supabase klienta pre serverové prostredie (request/response).
  2. Získa aktuálneho prihláseného používateľa.
  3. Ak používateľ nie je prihlásený a snaží sa dostať na chránenú trasu, je presmerovaný na `/auth/login`.
  4. Ak je prihlásený, požiadavka pokračuje ďalej.

### Prihlasovací a Odhlasovací Proces

- **Prihlásenie (`/auth/login`):** Komponent `login-form.tsx` používa klientskeho Supabase klienta na volanie `supabase.auth.signInWithPassword()`. Po úspešnom prihlásení je používateľ presmerovaný na `/admin/products`.
- **Odhlásenie (`logout-button.tsx`):** Tlačidlo volá `supabase.auth.signOut()`, následne `router.refresh()` na zabezpečenie úplného obnovenia stavu na strane servera a klienta, a nakoniec presmeruje na `/auth/login`.

---

## 4. Administrátorská Sekcia (`/admin`)

Poskytuje rozhranie na správu obsahu e-shopu. Je plne oddelená od verejného vzhľadu vďaka vlastnému `layout.tsx`.

### Správa Produktov (CRUD)

- **Zoznam produktov (`/admin/products`):** Zobrazuje tabuľku všetkých produktov s možnosťami úpravy a mazania.
- **Pridanie/Úprava produktu:** Využíva spoločný komponent `ProductForm`.
- **Server Actions (`productActions.tsx`):** Obsahuje funkcie `addProduct`, `updateProduct` a `deleteProduct`, ktoré komunikujú s databázou. Využívajú `Zod` na validáciu dát z formulára a vracajú štruktúrovaný stav (`State`) pre zobrazenie chýb alebo úspešných správ.
- **Riešenie chýb:** Pri mazaní produktu sa odchytáva špecifická chyba (`23503`), ak je produkt viazaný na existujúcu objednávku, a používateľovi sa zobrazí zrozumiteľná správa.

### Riešenie Build Chyby

Počas vývoja sa vyskytla neštandardná typová chyba v `app/admin/products/edit/[id]/page.tsx`. Ako riešenie bolo nutné použiť typ `any` pre `props` a potlačiť pravidlo ESLint pre daný riadok. Toto je zdokumentované priamo v kóde pre budúce referencie.

---

## 5. Backend a API

- **Supabase Klient (`/lib/supabase`):** Obsahuje funkcie na vytvorenie klientskych, serverových a middleware Supabase klientov, čo zaisťuje správny kontext pre prácu s dátami.
- **API Routes (`/app/api`):**
  - `/api/checkout`: Spracováva požiadavky na vytvorenie Stripe checkout session.
  - `/api/webhook`: Prijíma a spracováva webhooky od Stripe po úspešnej platbe.

---

## 6. Build a Nasadenie

- **Spustenie vývojového servera:** `npm run dev`
- **Kontrola kvality kódu:** `npm run lint`
- **Vytvorenie produkčného buildu:** `npm run build`

Projekt je pripravený na nasadenie na platformách ako Vercel alebo Netlify.

---

# Dokumentácia projektu E-shop

**Dátum generovania:** 2025-07-08

---

### 1. Celkový prehľad a použité technológie

Projekt je moderná webová aplikácia typu e-shop postavená na nasledujúcich technológiách:

*   **Framework:** [Next.js](https://nextjs.org/) (React framework s App Routerom)
*   **Jazyk:** [TypeScript](https://www.typescriptlang.org/)
*   **Backend a databáza:** [Supabase](https://supabase.io/) (poskytuje databázu, autentifikáciu, a úložisko)
*   **Spracovanie platieb:** [Stripe](https://stripe.com/)
*   **Štýlovanie:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Komponenty:** Pravdepodobne [shadcn/ui](https://ui.shadcn.com/) (súdiac podľa `components.json` a štruktúry `components/ui`)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand) (súdiac podľa `use-cart-store.ts`)
*   **E-mailové šablóny:** [React Email](https://react.email/) (súdiac podľa adresára `emails`)

Aplikácia poskytuje funkcionalitu pre zákazníkov (prezeranie produktov, nákupný košík, platba) a administrátorov (správa produktov).

---

### 2. Štruktúra projektu

#### `app/`
Hlavný adresár aplikácie, ktorý využíva Next.js App Router.

*   **`app/(main)/`**: Obsahuje hlavné, verejne prístupné stránky aplikácie (napr. domovská stránka, zoznam produktov).
*   **`app/admin/`**: Sekcia pre administrátorov. Obsahuje stránky na správu produktov (vytváranie, úprava, mazanie). Prístup je pravdepodobne chránený.
*   **`app/api/`**: Definuje API endpointy. Využíva sa na komunikáciu s backend službami ako Stripe (napr. cez webhooks).
*   **`app/auth/`**: Stránky súvisiace s autentifikáciou používateľov – prihlásenie, registrácia, zabudnuté heslo.
*   **`app/protected/`**: Stránky, ktoré sú prístupné len pre prihlásených používateľov (napr. profil, história objednávok).
*   **`layout.tsx`**: Hlavný layout aplikácie, ktorý obaľuje všetky stránky. Definuje základnú HTML štruktúru, načítava globálne štýly a fonty.
*   **`globals.css`**: Globálne CSS štýly pre celú aplikáciu.

#### `components/`
Adresár s React komponentmi, ktoré sú znovupoužiteľné naprieč aplikáciou.

*   **`auth-button.tsx`**: Komponent, ktorý zobrazuje buď "Prihlásiť sa" alebo meno používateľa s možnosťou odhlásenia.
*   **`login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`**: Formuláre pre autentifikáciu.
*   **`products/`**: Komponenty špecifické pre zobrazovanie produktov (napr. karta produktu, zoznam produktov).
*   **`checkout/`**: Komponenty pre proces nákupného košíka a platby.
*   **`ui/`**: Základné, generické UI komponenty ako `Button`, `Input`, `Card`, atď. (pravdepodobne zo `shadcn/ui`).
*   **`theme-switcher.tsx`**: Komponent na prepínanie medzi svetlou a tmavou témou.

#### `hooks/`
Obsahuje vlastné (custom) React hooks.

*   **`use-cart-store.ts`**: Kľúčový hook pre správu stavu nákupného košíka. Umožňuje pridávať, odoberať a upravovať položky v košíku a zdieľať tento stav medzi komponentmi.

#### `lib/`
Pomocné funkcie a knižnice.

*   **`stripe.ts`**: Inicializácia a konfigurácia Stripe klienta pre komunikáciu so Stripe API.
*   **`supabase/`**: Obsahuje konfiguráciu Supabase klienta (`client.ts`), server-side klienta (`server.ts`) a prípadné pomocné funkcie pre prácu s databázou (`utils.ts`).
*   **`types.ts`**: Definuje globálne TypeScript typy používané v projekte (napr. `Product`, `CartItem`).
*   **`utils.ts`**: Všeobecné pomocné funkcie (napr. formátovanie ceny, dátumu).

#### `emails/`
Obsahuje šablóny pre e-maily (napr. potvrdenie objednávky, reset hesla) vytvorené pomocou React Email.

#### `middleware.ts`
Next.js middleware, ktorý sa spúšťa pred spracovaním požiadavky. Pravdepodobne sa používa na ochranu chránených stránok (`/admin`, `/protected`) a presmerovanie neprihlásených používateľov na prihlasovaciu stránku.

#### Koreňový adresár
*   **`.env`, `.env.local`**: Súbory s premennými prostredia (API kľúče, prihlasovacie údaje k databáze). **Tieto súbory by nikdy nemali byť súčasťou Git repozitára.**
*   **`next.config.js`, `next.config.ts`**: Konfiguračné súbory pre Next.js.
*   **`tailwind.config.ts`**: Konfigurácia pre Tailwind CSS (definícia farieb, fontov, rozšírení).
*   **`tsconfig.json`**: Konfigurácia TypeScript kompilátora.
*   **`package.json`**: Definuje závislosti projektu a skripty (napr. `dev`, `build`, `start`).

---
