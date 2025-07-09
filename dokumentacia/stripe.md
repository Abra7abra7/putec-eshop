# Integrácia Platobnej Brány (Stripe)

Stripe je kľúčovou súčasťou e-shopu, ktorá zabezpečuje bezpečné a spoľahlivé spracovanie online platieb. Integrácia pokrýva celý životný cyklus platby.

## Proces Platby (Checkout Flow)

1.  **Vytvorenie platobnej relácie (Checkout Session):**
    - Keď zákazník klikne na tlačidlo "Prejsť do pokladne", na serveri sa spustí Server Action.
    - Táto akcia vytvorí v Stripe novú `Checkout Session`.
    - Do session sa posielajú kľúčové informácie:
        - **Položky (`line_items`):** Zoznam produktov v košíku, ich množstvo a cena.
        - **Režim (`mode`):** Nastavený na `'payment'`, pretože ide o jednorazovú platbu.
        - **URL adresy (`success_url`, `cancel_url`):** Adresy, na ktoré bude zákazník presmerovaný po úspešnej alebo zrušenej platbe.

2.  **Presmerovanie na Stripe:**
    - Po úspešnom vytvorení session vráti Stripe unikátnu URL adresu.
    - Aplikácia presmeruje zákazníka na túto zabezpečenú stránku Stripe, kde zadá svoje platobné údaje (karta, Apple Pay, Google Pay).
    - Celý proces zadávania citlivých údajov prebieha na strane Stripe, čím je zaistená maximálna bezpečnosť a zhoda s PCI DSS.

3.  **Spracovanie výsledku platby (Webhook):**
    - Po dokončení platby (úspešnej alebo neúspešnej) Stripe odošle asynchrónne upozornenie (webhook) na náš preddefinovaný API endpoint: `POST /api/checkout`.
    - Tento endpoint je zodpovedný za:
        - **Overenie požiadavky:** Skontroluje, či webhook skutočne prišiel od Stripe.
        - **Spracovanie udalosti:** Na základe typu udalosti (napr. `checkout.session.completed`) vykoná potrebné kroky.
        - **Vytvorenie objednávky:** Ak bola platba úspešná, v našej databáze sa vytvorí záznam o novej objednávke a aktualizuje sa stav skladu.
        - **Odoslanie potvrdenia:** Zákazníkovi sa odošle e-mail s potvrdením objednávky.

## Kľúčové súbory

- **`/lib/stripe.ts`**: Inicializácia Stripe klienta s API kľúčmi.
- **`/app/cart/actions.ts`** (príklad): Server Action, ktorá vytvára Checkout Session.
- **`/app/api/checkout/route.ts`**: Route Handler, ktorý spracováva prichádzajúce webhooky od Stripe.

## Premenné prostredia

Pre správne fungovanie sú potrebné nasledujúce premenné v `.env.local`:

- `STRIPE_SECRET_KEY`: Tajný kľúč pre komunikáciu so Stripe API.
- `STRIPE_WEBHOOK_SECRET`: Kľúč pre overovanie webhookov.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Verejný kľúč pre front-end.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

**Stripe** bude použitý ako hlavná platobná brána pre spracovanie online platieb kartou. Integrácia bude využívať **Stripe Checkout**, čo je predpripravená a hosťovaná platobná stránka, ktorá zjednodušuje implementáciu a spĺňa bezpečnostné štandardy (PCI DSS).

## 1. Nastavenie

1.  **Inštalácia:**
    ```bash
    npm install stripe
    ```
2.  **Konfigurácia:** Vytvoríme klienta v `lib/stripe.ts` a načítame API kľúče (verejný a tajný) z `.env.local`.
    ```typescript
    // lib/stripe.ts
    import Stripe from 'stripe';

    export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    ```

## 2. Nákupný Proces s Platbou Kartou

1.  **Vytvorenie Checkout Session:**
    - Keď zákazník v pokladni potvrdí objednávku a zvolí platbu kartou, serverová akcia `createOrder` zavolá Stripe API.
    - Vytvorí sa `Stripe.Checkout.Session` s nasledujúcimi parametrami:
        - `line_items`: Pole položiek v košíku s názvom, cenou a množstvom.
        - `mode`: `'payment'`.
        - `success_url`: URL, na ktorú bude zákazník presmerovaný po úspešnej platbe (napr. `https://vas-eshop.sk/objednavka/{CHECKOUT_SESSION_ID}`).
        - `cancel_url`: URL pre prípad, že zákazník platbu zruší (napr. späť do košíka `https://vas-eshop.sk/kosik`).
        - `metadata`: Kľúčové pole, kam uložíme `order_id` našej internej objednávky. Toto ID použijeme na spárovanie platby s objednávkou vo webhooku.

2.  **Presmerovanie na Stripe:**
    - Serverová akcia vráti URL Stripe Checkout session.
    - Front-end presmeruje zákazníka na túto URL.

3.  **Spracovanie Platby:**
    - Zákazník zadá údaje o karte na zabezpečenej stránke Stripe.
    - Stripe spracuje platbu.

4.  **Webhook Notifikácia:**
    - Po úspešnej platbe Stripe odošle udalosť `checkout.session.completed` na náš endpoint `/api/stripe`.
    - Náš backend overí požiadavku, načíta `order_id` z metadát a aktualizuje stav objednávky v databáze na `paid`.

5.  **Presmerovanie Zákazníka:**
    - Stripe presmeruje zákazníka na `success_url`.
    - Na tejto stránke zobrazíme poďakovanie a potvrdenie objednávky. Stav objednávky sa načíta z databázy, aby sme mali istotu, že platba bola spracovaná.

## 3. Platba na Dobierku (Cash on Delivery - COD)

- Ak si zákazník zvolí platbu na dobierku, proces je jednoduchší:
  1. Serverová akcia `createOrder` vytvorí objednávku v databáze so stavom `cod` a platobnou metódou `cod`.
  2. Zákazník je priamo presmerovaný na stránku s potvrdením objednávky.
  3. Stav objednávky sa zmení na `paid` až po manuálnom potvrdení v administrácii (keď kuriér doručí peniaze).

## 4. Bezpečnosť

- **Tajné kľúče:** Všetky operácie, ktoré vyžadujú tajný Stripe kľúč (`STRIPE_SECRET_KEY`), sa budú vykonávať výhradne na serveri (v Server Actions alebo API routes).
- **Webhooky:** Endpoint pre webhooky bude chránený overením `Stripe-Signature`, aby sa zabránilo falošným požiadavkám.
