# API Endpoints a Server Actions

Architektúra aplikácie bude primárne využívať **Next.js Server Actions** pre formuláre a mutácie dát, čím sa minimalizuje potreba tradičných API endpointov. Dedikované API routes budú vytvorené len pre špecifické prípady, ako sú webhooky od externých služieb.

## 1. Server Actions

Server Actions sú asynchrónne funkcie, ktoré bežia na serveri a môžu byť volané priamo z React komponentov (klientskych aj serverových). Sú ideálne pre spracovanie formulárov.

### Akcie, ktoré budú implementované:

- **`createOrder(formData)`**: Spracuje formulár z pokladne.
  - **Vstup:** Dáta z formulára (`FormData`).
  - **Logika:**
    1. Validuje vstupné dáta.
    2. Načíta produkty z košíka (z `localStorage` cez skryté pole alebo z klienta).
    3. Overí ceny a dostupnosť produktov v databáze.
    4. Vytvorí záznamy v `orders` a `order_items`.
    5. Ak je platba cez Stripe, vytvorí Stripe Checkout Session a vráti jej URL na presmerovanie.
    6. Ak je platba na dobierku, vráti ID objednávky pre zobrazenie potvrdzovacej stránky.
  - **Použitie:** Volaná z `CheckoutForm.tsx`.

- **`createInquiry(formData)`**: Spracuje dopytový formulár pre zážitky.
  - **Vstup:** Dáta z formulára (`FormData`).
  - **Logika:**
    1. Validuje vstupné dáta.
    2. Uloží dopyt do tabuľky `inquiries`.
    3. Spustí odoslanie notifikačných emailov cez Resend.
  - **Použitie:** Volaná z `InquiryForm.tsx`.

- **`updateCart(cartItems)`**: Prípadná akcia pre synchronizáciu košíka prihláseného používateľa s databázou (voliteľné rozšírenie).

## 2. API Routes (`/app/api`)

### a) Stripe Webhook

- **Endpoint:** `POST /api/stripe`
- **Súbor:** `/app/api/stripe/route.ts`
- **Účel:** Prijímať a spracovávať udalosti od Stripe. Je to kľúčový endpoint pre automatizáciu spracovania platieb.
- **Zabezpečenie:** Každá požiadavka od Stripe musí byť overená pomocou `Stripe-Signature` hlavičky. Knižnica `stripe` poskytuje na to vstavanú funkciu.

- **Spracovávané udalosti:**
  - **`checkout.session.completed`:**
    - Najdôležitejšia udalosť. Spustí sa po úspešnom dokončení platby zákazníkom.
    - **Logika:**
      1. Načíta session ID z udalosti.
      2. Získa `order_id` z metadát session.
      3. Nájde objednávku v databáze a aktualizuje jej stav na `paid`.
      4. Spustí odoslanie potvrdzovacieho emailu a faktúry zákazníkovi.

  - **`charge.refunded`:**
    - Spustí sa, ak dôjde k vráteniu peňazí.
    - **Logika:** Aktualizuje stav objednávky na `refunded` a prípadne odošle notifikáciu.

### b) Iné potenciálne API routes

- **`/api/bookio/availability` (Alternatíva k iFrame):**
  - Ak by sme sa rozhodli pre plnú API integráciu s Bookio, tento endpoint by slúžil ako proxy medzi naším front-endom a Bookio API na získavanie dostupnosti termínov. Týmto spôsobom by sme skryli náš Bookio API kľúč pred klientom.
