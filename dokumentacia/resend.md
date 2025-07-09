# Integrácia Transakčných Emailov (Resend)

Resend je moderná služba na odosielanie transakčných e-mailov, ktorá je v projekte využívaná na komunikáciu so zákazníkmi po kľúčových udalostiach, ako je napríklad vytvorenie objednávky.

## Kľúčové vlastnosti integrácie

### 1. E-mailové šablóny ako React komponenty

Najväčšou výhodou tejto integrácie je možnosť vytvárať e-mailové šablóny priamo ako React komponenty. Tým sa dosahuje:

- **Jednoduchá údržba:** Dizajn a obsah e-mailov sa upravuje rovnako ako akákoľvek iná časť webu.
- **Znovu použiteľnosť:** Komponenty môžu byť ľahko opakovane použité a prispôsobené.
- **Typová kontrola:** Vďaka TypeScriptu máme istotu, že do šablón posielame správne dáta (napr. meno zákazníka, číslo objednávky).

Šablóny sú umiestnené v adresári `/emails`.

- **Príklad (`/emails/OrderConfirmation.tsx`):**
  ```tsx
  import { Body, Container, Heading, Text } from '@react-email/components';
  import * as React from 'react';

  interface OrderConfirmationEmailProps {
    customerName: string;
    orderId: string;
  }

  export const OrderConfirmationEmail = ({ customerName, orderId }: OrderConfirmationEmailProps) => (
    <Container>
      <Heading>Ďakujeme za vašu objednávku!</Heading>
      <Text>Ahoj {customerName},</Text>
      <Text>Vaša objednávka s číslom {orderId} bola úspešne prijatá.</Text>
    </Container>
  );
  ```

### 2. Proces odosielania

- **Inicializácia:** Klient pre Resend je inicializovaný v `/lib/resend.ts` pomocou API kľúča.
- **Spúšťanie:** Odosielanie e-mailov je spúšťané zo serverovej logiky, najčastejšie po spracovaní webhooku od Stripe alebo po inej dôležitej akcii.
- **Renderovanie:** Pred odoslaním sa príslušný React komponent (e-mailová šablóna) vyrenderuje do HTML.
- **Odoslanie:** Vyrenderované HTML sa spolu s ďalšími údajmi (príjemca, predmet) odošle cez Resend API.

## Používané e-maily

- **Potvrdenie objednávky:** Odosiela sa zákazníkovi po úspešnom dokončení platby.
- **Potvrdenie registrácie:** E-mail s overovacím linkom po vytvorení nového účtu.
- **Obnova hesla:** E-mail s inštrukciami na resetovanie zabudnutého hesla.

## Premenné prostredia

Pre fungovanie je potrebný kľúč v `.env.local`:

- `RESEND_API_KEY`: API kľúč pre prístup k službe Resend.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

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
