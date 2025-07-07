# Front-end Architektúra

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
