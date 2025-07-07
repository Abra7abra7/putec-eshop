# Integrácia Transakčných Emailov (Resend)

**Resend** bude slúžiť ako služba na spoľahlivé odosielanie a doručovanie všetkých automatizovaných emailov zákazníkom a administrátorom. Využijeme ich React Email knižnicu na vytváranie pekných a responzívnych emailových šablón pomocou React komponentov.

## 1. Nastavenie

1.  **Inštalácia:**
    ```bash
    npm install resend react-email
    ```
2.  **Konfigurácia:** Vytvoríme klienta v `lib/resend.ts` a načítame API kľúč z `.env.local`.
    ```typescript
    // lib/resend.ts
    import { Resend } from 'resend';

    export const resend = new Resend(process.env.RESEND_API_KEY);
    ```
3.  **Emailové šablóny:** Vytvoríme priečinok `/emails`, kde budú umiestnené všetky React komponenty pre jednotlivé emailové šablóny.

## 2. Zoznam Automatizovaných Emailov

### a) Pre Zákazníka

- **Potvrdenie objednávky:**
  - **Spúšťač:** Úspešné vytvorenie objednávky (stav `paid` alebo `cod`).
  - **Obsah:** Zhrnutie objednávky, číslo objednávky, dodacia adresa, celková suma, odkaz na sledovanie stavu.
  - **Šablóna:** `OrderConfirmationEmail.tsx`

- **Potvrdenie o prijatí dopytu:**
  - **Spúšťač:** Úspešné odoslanie dopytového formulára na zážitok.
  - **Obsah:** Poďakovanie, zhrnutie dopytu (typ zážitku, počet osôb, požadovaný termín), informácia, že zákazník bude čoskoro kontaktovaný.
  - **Šablóna:** `InquiryConfirmationEmail.tsx`

- **Automatické zaslanie faktúry:**
  - **Spúšťač:** Aktualizácia stavu objednávky na `paid`.
  - **Obsah:** Email s priloženou PDF faktúrou.
  - **Poznámka:** Generovanie PDF faktúry bude riešené samostatnou knižnicou (napr. `@react-pdf/renderer`) a následne priložené k emailu cez Resend.
  - **Šablóna:** `InvoiceEmail.tsx`

- **Notifikácia o odoslaní objednávky:**
  - **Spúšťač:** Manuálna zmena stavu objednávky na `shipped` v administrácii.
  - **Obsah:** Informácia o odoslaní, sledovacie číslo zásielky (ak je k dispozícii), odkaz na kuriérsku službu.
  - **Šablóna:** `OrderShippedEmail.tsx`

### b) Pre Administrátora (Majiteľa)

- **Notifikácia o novej objednávke:**
  - **Spúšťač:** Úspešné vytvorenie akejkoľvek novej objednávky.
  - **Obsah:** Upozornenie na novú objednávku, číslo objednávky, zoznam produktov, kontaktné údaje zákazníka.
  - **Šablóna:** `NewOrderAdminNotification.tsx`

- **Notifikácia o novom dopyte:**
  - **Spúšťač:** Prijatie nového dopytu na zážitok.
  - **Obsah:** Upozornenie na nový dopyt, všetky detaily z formulára (meno, kontakt, termín, počet osôb, správa).
  - **Šablóna:** `NewInquiryAdminNotification.tsx`

## 3. Implementácia

- Odosielanie emailov bude prebiehať výhradne na serveri (v rámci Server Actions alebo API routes), aby bol API kľúč v bezpečí.
- Každá funkcia na odoslanie emailu bude prijímať potrebné dáta (napr. objekt objednávky) a renderovať príslušnú React šablónu do HTML pred odoslaním.
