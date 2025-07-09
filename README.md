# E-shop Vinárstvo Pútec

Tento projekt je moderný e-shop vytvorený pre Vinárstvo Pútec. Je postavený na platforme Next.js a integruje kľúčové technológie pre robustné a škálovateľné riešenie, vrátane správy produktov, online platieb a automatizovaných e-mailov.

## Technologický balík

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Databáza a Autentifikácia:** [Supabase](https://supabase.com)
- **Platobná brána:** [Stripe](https://stripe.com)
- **Odosielanie e-mailov:** [Resend](https://resend.com)
- **Štýlovanie:** [Tailwind CSS](https://tailwindcss.com)
- **UI Komponenty:** [Shadcn/UI](https://ui.shadcn.com/)
- **Validácia formulárov:** [Zod](https://zod.dev/)

---

## Štruktúra projektu

Projekt má logickú a škálovateľnú štruktúru, ktorá oddeľuje jednotlivé časti aplikácie.

- **`/app`**: Jadro aplikácie s využitím Next.js App Router.
  - **`/(main)`**: Hlavné stránky pre zákazníkov (domov, o nás, e-shop, atď.).
  - **`/admin`**: Zabezpečená sekcia pre správu produktov a objednávok.
  - **`/api`**: Serverové trasy pre spracovanie webhookov (napr. od Stripe) a iných API požiadaviek.
  - **`/auth`**: Stránky a logika pre prihlásenie, registráciu a správu používateľských účtov.

- **`/components`**: Znovu použiteľné React komponenty.
  - **`/ui`**: Základné UI prvky generované cez Shadcn/UI (tlačidlá, formuláre, karty).
  - **`/layout`**: Komponenty pre štruktúru stránky (hlavička, päta).
  - **Ostatné**: Špecifické komponenty pre produkty, formuláre a ďalšie funkcie.

- **`/lib`**: Pomocné funkcie a konfigurácia externých služieb.
  - **`supabase/`**: Klienti (serverový, klientsky) pre komunikáciu so Supabase.
  - **`stripe.ts`**: Inštancia a konfigurácia Stripe klienta.
  - **`utils.ts`**: Všeobecné pomocné funkcie (napr. formátovanie meny).

- **`/emails`**: React komponenty slúžiace ako šablóny pre e-maily odosielané cez Resend.

---

## Kľúčové integrácie

### Supabase (Databáza a Autentifikácia)

Supabase slúži ako backend pre tento projekt. Poskytuje PostgreSQL databázu, autentifikačný systém a úložisko súborov.

**Databázová schéma:**

- **`products`**: Informácie o produktoch (názov, popis, cena, obrázky, kategória).
- **`categories`**: Kategórie pre produkty (napr. Biele víno, Červené víno).
- **`orders`**: Záznamy o objednávkach (ID zákazníka, stav, celková suma).
- **`order_items`**: Položky v rámci jednotlivej objednávky.

**Autentifikácia:**
Systém využíva Supabase Auth pre správu používateľov. Podporuje prihlásenie pomocou e-mailu a hesla. Prístup do administrátorskej sekcie (`/admin`) je chránený a vyžaduje prihlásenie.

### Stripe (Platobná brána)

Stripe je integrovaný pre bezpečné spracovanie online platieb. Platobný proces je nasledovný:

1.  Zákazník pridá produkty do košíka.
2.  V pokladni (`/pokladna`) sa vytvorí Stripe Checkout Session.
3.  Zákazník je presmerovaný na zabezpečenú platobnú stránku Stripe.
4.  Po úspešnej platbe je zákazník presmerovaný späť na ďakovnú stránku.
5.  Stripe odošle webhook udalosť na `/api/checkout`, ktorá zaeviduje objednávku v databáze.

### Resend (Transakčné e-maily)

Resend sa používa na odosielanie automatizovaných e-mailov, ako je napríklad potvrdenie objednávky. E-mailové šablóny sú definované ako React komponenty v adresári `/emails`.

---

## Lokálne spustenie projektu

Pre spustenie projektu na lokálnom počítači postupujte podľa nasledujúcich krokov:

1.  **Naklonujte repozitár:**
    ```bash
    git clone https://github.com/Abra7abra7/putec-eshop.git
    cd putec-eshop
    ```

2.  **Nainštalujte závislosti:**
    ```bash
    npm install
    ```

3.  **Nastavte premenné prostredia:**
    - Skopírujte súbor `.env.local.example` a premenujte ho na `.env.local`.
    - Vyplňte všetky požadované hodnoty:
      - **Supabase:** `NEXT_PUBLIC_SUPABASE_URL` a `NEXT_PUBLIC_SUPABASE_ANON_KEY` nájdete v nastaveniach vášho Supabase projektu.
      - **Stripe:** `STRIPE_SECRET_KEY` a `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` nájdete vo vašom Stripe Dashboard.
      - **Resend:** `RESEND_API_KEY` získate z vášho Resend účtu.

4.  **Spustite vývojový server:**
    ```bash
    npm run dev
    ```

Aplikácia by mala byť dostupná na adrese [http://localhost:3000](http://localhost:3000).

Code Rabbit
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Abra7abra7/putec-eshop?utm_source=oss&utm_medium=github&utm_campaign=Abra7abra7%2Fputec-eshop&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

