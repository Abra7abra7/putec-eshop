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
