# Backend Architektúra so Supabase

Celý backend projektu je postavený na platforme Supabase, ktorá poskytuje komplexné riešenie "Backend as a Service" (BaaS). Tým sa zjednodušuje vývoj a správa serverovej časti aplikácie.

## Kľúčové služby Supabase v projekte

### 1. PostgreSQL Databáza
Srdcom backendu je plne spravovaná PostgreSQL databáza. Databáza je navrhnutá tak, aby podporovala všetky funkcie e-shopu a portálu. Okrem správy produktov (`products`), kategórií (`categories`) a objednávok (`orders`), systém teraz spravuje aj ponuku zážitkov (`experiences`) a eviduje dopyty od zákazníkov (`inquiries`).

- **Priamy prístup:** Aplikácia komunikuje s databázou priamo cez Supabase klientov, čo eliminuje potrebu tradičného REST alebo GraphQL API pre základné CRUD operácie.
- **Row-Level Security (RLS):** Bezpečnosť dát je zaistená pomocou RLS politík. Tieto politiky definujú, ktorí používatelia majú prístup k jednotlivým riadkom v tabuľkách. Napríklad, bežný používateľ môže čítať iba svoje vlastné objednávky, zatiaľ čo administrátor vidí všetky.
- **Schéma:** Detailný popis tabuliek a ich vzťahov sa nachádza v dokumente [Schéma Databázy](./schema_tabuliek.md).

### 2. Autentifikácia (Supabase Auth)
Supabase Auth rieši kompletnú správu používateľov a ich prihlasovanie.

- **Metódy:** Projekt využíva prihlasovanie pomocou e-mailu a hesla.
- **Správa relácií:** Balíček `supabase/ssr` sa stará o bezpečnú správu používateľských relácií (sessions) pomocou cookies. To zaisťuje, že stav prihlásenia je dostupný na serveri aj na klientovi.
- **Chránené trasy:** Pomocou Next.js middleware (`middleware.ts`) sú chránené administrátorské trasy (`/admin`), ktoré sú prístupné iba po prihlásení.

### 3. Úložisko (Supabase Storage)
Služba Supabase Storage sa používa na ukladanie a správu súborov, predovšetkým obrázkov k produktom.

- **Nahrávanie:** Obrázky sa nahrávajú priamo z administrátorského rozhrania.
- **Optimalizácia:** Supabase Storage umožňuje transformáciu obrázkov (napr. zmena veľkosti, orezanie) priamo cez URL, čo pomáha optimalizovať rýchlosť načítania stránok.
- **Prístupové práva:** Prístup k súborom je riadený pomocou politík, ktoré definujú, či sú súbory verejné alebo súkromné.

## Komunikácia s Backendom

Interakcia medzi Next.js aplikáciou a Supabase prebieha pomocou dvoch typov klientov definovaných v `/lib/supabase/`:

- **Serverový klient (`server.ts`):** Používa sa v Server Components, Route Handlers a Server Actions. Má prístup k citlivým operáciám.
- **Klientsky klient (`client.ts`):** Používa sa v Client Components pre operácie, ktoré nevyžadujú administrátorské práva (napr. načítanie produktov).

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

Backendová časť aplikácie bude plne postavená na službe **Supabase**, ktorá poskytuje všetky potrebné nástroje na beh moderného e-shopu bez potreby spravovať vlastný server.

## 1. Jadro Backendu

- **Platforma:** **Supabase**
- **Databáza:** **PostgreSQL** (plne spravovaná)
- **API:** **Auto-generované REST a GraphQL API** nad databázovými tabuľkami.
- **Autentifikácia:** **Supabase Auth** pre správu používateľov a zabezpečenie prístupu.
- **Storage:** **Supabase Storage** pre ukladanie obrázkov produktov a iných súborov.

## 2. Spracovanie Objednávok

1.  **Vytvorenie objednávky:**
    - Po odoslaní formulára v pokladni sa na serveri (cez **Next.js Server Action**) zavolá funkcia, ktorá:
        1.  Validuje dáta zo vstupu.
        2.  Vypočíta celkovú sumu na základe produktov v košíku a cien z databázy (nikdy neveriť cenám z klienta).
        3.  Vytvorí záznam v tabuľke `orders`.
        4.  Vytvorí záznamy pre každú položku v tabuľke `order_items`.
        5.  Stav objednávky sa nastaví na `pending` (čaká na platbu) alebo `cod` (dobierka).

2.  **Spracovanie platby (Stripe):**
    - Ak si zákazník zvolí platbu kartou, aplikácia vytvorí **Stripe Checkout Session** a presmeruje ho na platobnú bránu.
    - Po úspešnej platbe Stripe odošle **webhook** na náš API endpoint (`/api/stripe/route.ts`).
    - Tento endpoint bezpečne overí požiadavku od Stripe, nájde príslušnú objednávku v databáze a aktualizuje jej stav na `paid`.

## 3. Spracovanie Dopytov na Zážitky

- Dopyty sa nespracúvajú ako klasické objednávky, ale ako samostatné záznamy.
- Formulár na detaile zážitku odošle dáta (cez **Server Action**), ktoré sa uložia do tabuľky `inquiries` so stavom `new`.
- Súčasne sa spustí odoslanie notifikačného emailu majiteľovi (cez **Resend**).
- Ďalšia komunikácia a platba prebieha manuálne mimo systém.

## 4. API Endpoints (`/app/api`)

- Hoci väčšina interakcií s databázou prebehne cez Supabase JS klienta a Server Actions, pre niektoré prípady sú potrebné dedikované API routes:
  - **`/api/stripe/route.ts` (Webhook):**
    - Prijíma a spracúva notifikácie od Stripe (napr. `checkout.session.completed`).
    - Je to kritický endpoint, ktorý musí byť zabezpečený overením Stripe signature.

## 5. Administrácia

- **Supabase Studio:** Pre základnú správu (CRUD operácie) bude slúžiť vstavané rozhranie Supabase.
  - Správa produktov (pridávanie, úprava cien, skladových zásob).
  - Prehľad a zmena stavu objednávok.
  - Správa dopytov.
- **Vlastné rozhranie (Budúci rozvoj):** Pre pokročilejšie funkcie, ako je analytika, reporty alebo hromadné úpravy, je možné v budúcnosti vytvoriť vlastnú admin sekciu priamo v Next.js aplikácii, chránenú heslom a rolami.
