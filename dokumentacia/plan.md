# Implementačný Plán: Vinársky E-shop

Tento dokument sleduje postup prác na projekte a definuje kľúčové fázy a úlohy.

**Aktuálny stav:** Projekt je vo finálnej fáze vývoja. Väčšina kľúčových funkcií je implementovaná a prebieha testovanie a finalizácia.

--- 

### Fáza 1: Základy a Architektúra (Hotovo ✔️)
- [x] Inicializácia Next.js projektu.
- [x] Nastavenie a konfigurácia Tailwind CSS.
- [x] Vytvorenie základnej štruktúry adresárov (`/app`, `/components`, `/lib`).
- [x] Pripojenie k Supabase a nastavenie klientov.
- [x] Vytvorenie základného layoutu (`Header`, `Footer`).

### Fáza 2: E-shop a Produkty (Hotovo ✔️)
- [x] Návrh a implementácia databázovej schémy (`products`, `categories`).
- [x] Vytvorenie stránky s výpisom všetkých produktov.
- [x] Vytvorenie stránky s detailom produktu.
- [x] Implementácia kategórií a filtrovania produktov.
- [x] Vytvorenie administrátorského rozhrania pre správu produktov (CRUD).

### Fáza 3: Autentifikácia a Používatelia (Hotovo ✔️)
- [x] Implementácia prihlásenia a registrácie pomocou Supabase Auth.
- [x] Vytvorenie chránených trás pre administrátorov (`middleware.ts`).
- [x] Návrh a implementácia tabuľky `profiles`.
- [x] Vytvorenie stránky používateľského profilu.

### Fáza 4: Nákupný Košík a Pokladňa (Hotovo ✔️)
- [x] Implementácia správy nákupného košíka (pridanie, odobratie, aktualizácia).
- [x] Integrácia Stripe Checkout pre spracovanie platieb.
- [x] Vytvorenie webhooku pre spracovanie úspešných platieb.
- [x] Návrh a implementácia schémy pre objednávky (`orders`, `order_items`).
- [x] Zobrazenie histórie objednávok v profile používateľa.

### Fáza 5: Komunikácia a Finalizácia (Prebieha ⏳)
- [x] Integrácia Resend pre odosielanie transakčných e-mailov (potvrdenie objednávky).
- [x] Implementácia kontaktného formulára.
- [x] Finalizácia dizajnu a responzivity (vrátane mobilnej navigácie).
- [ ] **Kompletná aktualizácia dokumentácie.**
- [ ] Dôkladné testovanie všetkých funkcií.
- [ ] Príprava na nasadenie (deployment).

### Fáza 6: Budúce rozšírenia (Plánované 📝)
- [ ] Integrácia rezervačného systému (Bookio) pre degustácie a ubytovanie.
- [ ] Implementácia blogu alebo sekcie s novinkami.
- [ ] Rozšírené možnosti filtrovania a triedenia produktov.
- [ ] Zákaznícke recenzie a hodnotenia produktov.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

Tento plán rozdeľuje vývoj projektu do logických fáz a úloh, aby bol proces systematický a prehľadný.

## Fáza 1: Základy a Nastavenie Projektu (1-2 dni)

Cieľom je pripraviť vývojové prostredie a základnú štruktúru aplikácie.

- **Úloha 1.1: Inicializácia Next.js projektu**
  - Sub-úloha: Overiť, či sú nainštalované všetky základné závislosti (`next`, `react`, `tailwindcss`).
- **Úloha 1.2: Nastavenie Supabase projektu**
  - Sub-úloha: Vytvoriť nový projekt v Supabase Studio.
  - Sub-úloha: Získať API URL a `anon` kľúč.
  - Sub-úloha: Uložiť kľúče do `.env.local` súboru.
- **Úloha 1.3: Konfigurácia externých služieb**
  - Sub-úloha: Vytvoriť účty v Stripe a Resend.
  - Sub-úloha: Získať API kľúče a uložiť ich do `.env.local`.
- **Úloha 1.4: Vytvorenie základnej štruktúry priečinkov**
  - Sub-úloha: Vytvoriť priečinky `/app`, `/components`, `/lib` podľa dokumentácie.
- **Úloha 1.5: Implementácia základného layoutu**
  - Sub-úloha: Vytvoriť `Header` a `Footer` komponenty.
  - Sub-úloha: Vložiť ich do hlavného `layout.tsx`.

## Fáza 2: Databáza a Produkty (2-3 dni)

Cieľom je navrhnúť a implementovať databázovú schému a zobraziť produkty.

- **Úloha 2.1: Implementácia databázovej schémy v Supabase**
  - Sub-úloha: Vytvoriť tabuľky `categories`, `products`, `experiences`, `inquiries`, `orders`, `order_items` pomocou SQL editora v Supabase.
  - Sub-úloha: Nastaviť cudzie kľúče, obmedzenia a predvolené hodnoty.
- **Úloha 2.2: Vytvorenie komponentov pre produkty**
  - Sub-úloha: `ProductCard.tsx` pre zobrazenie produktu v zozname.
  - Sub-úloha: `ProductList.tsx` pre zobrazenie mriežky produktov.
- **Úloha 2.3: Vytvorenie stránok pre zoznam a detail produktu**
  - Sub-úloha: Stránka `/vino`, ktorá načíta a zobrazí všetky vína.
  - Sub-úloha: Dynamická stránka `/vino/[slug]`, ktorá načíta a zobrazí detail konkrétneho produktu.

## Fáza 3: Nákupný Proces (3-4 dni)

Cieľom je implementovať plne funkčný nákupný košík a pokladňu.

- **Úloha 3.1: Implementácia nákupného košíka**
  - Sub-úloha: Vytvoriť React Context alebo Zustand store pre správu stavu košíka.
  - Sub-úloha: Synchronizovať stav košíka s `localStorage`.
  - Sub-úloha: Vytvoriť stránku `/kosik` so zobrazením obsahu a možnosťou úprav.
- **Úloha 3.2: Implementácia pokladne**
  - Sub-úloha: Vytvoriť `CheckoutForm.tsx` s prepínačom Fyzická/Právnická osoba.
  - Sub-úloha: Implementovať validáciu formulára.
- **Úloha 3.3: Vytvorenie Server Action `createOrder`**
  - Sub-úloha: Implementovať logiku pre vytvorenie objednávky v databáze.
- **Úloha 3.4: Integrácia Stripe Checkout**
  - Sub-úloha: V `createOrder` pridať logiku pre vytvorenie Stripe session.
  - Sub-úloha: Implementovať presmerovanie na Stripe.
- **Úloha 3.5: Vytvorenie Stripe Webhooku**
  - Sub-úloha: Vytvoriť API route `/api/stripe` na spracovanie úspešnej platby.
- **Úloha 3.6: Vytvorenie stránky na potvrdenie objednávky**
  - Sub-úloha: Stránka `/objednavka/[id]`, ktorá zobrazí poďakovanie a zhrnutie.

## Fáza 4: Zážitky a Dopyty (2 dni)

Cieľom je implementovať prezentáciu zážitkov a dopytový systém.

- **Úloha 4.1: Vytvorenie komponentov a stránok pre zážitky**
  - Sub-úloha: Stránka `/zazitky` so zoznamom všetkých zážitkov.
  - Sub-úloha: Stránka `/zazitky/[slug]` s detailom a dopytovým formulárom (`InquiryForm.tsx`).
- **Úloha 4.2: Vytvorenie Server Action `createInquiry`**
  - Sub-úloha: Implementovať logiku pre uloženie dopytu do databázy.

## Fáza 5: Automatizované Emaily a Integrácie (2-3 dni)

Cieľom je nastaviť odosielanie emailov a dokončiť externé integrácie.

- **Úloha 5.1: Vytvorenie emailových šablón v React Email**
  - Sub-úloha: Vytvoriť komponenty pre všetky definované emaily (potvrdenie objednávky, notifikácie atď.).
- **Úloha 5.2: Integrácia Resend**
  - Sub-úloha: Implementovať odosielanie emailov v rámci serverových akcií (`createOrder`, `createInquiry`) a webhooku.
- **Úloha 5.3: Integrácia Bookio**
  - Sub-úloha: Vytvoriť stránku `/ubytovanie` a vložiť do nej iFrame od Bookio.

## Fáza 6: Finálne Úpravy, Testovanie a Nasadenie (2-3 dni)

Cieľom je doladiť dizajn, otestovať všetky funkcionality a nasadiť aplikáciu.

- **Úloha 6.1: Dizajn a styling**
  - Sub-úloha: Prejsť celú aplikáciu a doladiť vizuál podľa dizajn manuálu.
  - Sub-úloha: Zabezpečiť plnú responzivitu na všetkých stránkach.
- **Úloha 6.2: Testovanie**
  - Sub-úloha: Kompletne otestovať nákupný proces (Stripe aj dobierka).
  - Sub-úloha: Otestovať dopytový formulár a doručenie emailov.
  - Sub-úloha: Otestovať responzivitu na reálnych zariadeniach.
- **Úloha 6.3: Príprava na nasadenie**
  - Sub-úloha: Nastaviť produkčné environmentálne premenné.
- **Úloha 6.4: Nasadenie**
  - Sub-úloha: Nasadiť aplikáciu na platformu ako Vercel alebo Netlify.
