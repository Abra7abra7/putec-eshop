# Využitie Supabase v Projekte

Supabase je kľúčovou technológiou tohto projektu, ktorá zastrešuje databázu, backend, autentifikáciu a ukladanie súborov. Tento prístup (Backend-as-a-Service) výrazne zrýchľuje vývoj a znižuje náklady na správu infraštruktúry.

## 1. Databáza (PostgreSQL)

- **Jadro:** Plne funkčná a spravovaná PostgreSQL databáza.
- **Schéma:** Vytvoríme vlastnú schému tabuliek presne podľa potrieb e-shopu (viď `schema_tabuliek.md`).
- **Row Level Security (RLS):** Pre zabezpečenie dát na úrovni riadkov. Napríklad, používateľ bude môcť čítať iba svoje vlastné objednávky. RLS politiky sú kľúčové pre bezpečnosť.
- **Funkcie a Triggery:** Možnosť písať vlastné PostgreSQL funkcie a triggery pre automatizáciu úloh priamo v databáze (napr. aktualizácia `updated_at` timestampu).

## 2. Autentifikácia (Supabase Auth)

- **Správa používateľov:** Kompletné riešenie pre registráciu, prihlásenie, reset hesla a správu používateľských účtov.
- **Prihlásenie cez tretie strany:** Jednoduchá integrácia prihlásenia cez Google, Facebook, atď. (ak by bolo v budúcnosti potrebné).
- **Zabezpečenie:** Využíva JSON Web Tokens (JWT) pre bezpečnú komunikáciu medzi klientom a backendom. Supabase klienti automaticky spravujú obnovovanie tokenov.
- **Integrácia s databázou:** Každý registrovaný používateľ má záznam v tabuľke `auth.users`, ktorý je prepojený s našimi dátami (napr. cez `user_id` v tabuľke `orders`).

## 3. Storage (Supabase Storage)

- **Ukladanie súborov:** Objektové úložisko pre obrázky produktov, galérie a prípadné ďalšie súbory (napr. PDF faktúry).
- **Organizácia:** Súbory budeme organizovať do tzv. "buckets" (napr. `product-images`, `invoices`).
- **Prístupové práva:** Možnosť nastaviť detailné pravidlá pre prístup k súborom (verejné vs. súkromné). Obrázky produktov budú verejné, faktúry súkromné a prístupné len konkrétnemu používateľovi.

## 4. Auto-generované API

- **Okamžité API:** Supabase automaticky generuje RESTful a GraphQL API nad našou databázou.
- **Klientske knižnice:** Namiesto priameho volania API budeme využívať **Supabase JS Client** (`@supabase/supabase-js`), ktorý poskytuje pohodlné a typovo bezpečné metódy na prácu s dátami (`select`, `insert`, `update`, `delete`).
- **Server-Side a Client-Side Klienti:**
  - **`lib/supabase/server.ts`:** Vytvorí klienta pre použitie v serverových komponentoch a Server Actions. Spravuje cookies pre autentifikáciu.
  - **`lib/supabase/client.ts`:** Vytvorí klienta pre použitie v klientskych komponentoch (`"use client"`).

## 5. Administrácia (Supabase Studio)

- **Webové rozhranie:** Supabase poskytuje prehľadné webové rozhranie (Studio) pre:
  - **Table Editor:** Priamu správu dát v tabuľkách ako v Exceli.
  - **SQL Editor:** Písanie a spúšťanie SQL príkazov.
  - **Auth a Storage Manžment:** Správu používateľov a súborov.
  - **Prehľad logov a štatistík.**

Toto rozhranie bude slúžiť ako primárny nástroj pre administráciu e-shopu v prvej fáze projektu.
