# Integrácia Rezervačného Systému (Bookio)

Táto časť dokumentácie popisuje plánovanú integráciu s externým rezervačným systémom Bookio. Cieľom je umožniť zákazníkom priamo cez e-shop rezervovať si degustácie alebo ubytovanie.

**Stav:** Plánované

## 1. Cieľ integrácie

- **Rezervácia degustácií:** Zákazníci si budú môcť vybrať termín a počet osôb pre degustáciu priamo na webe.
- **Rezervácia ubytovania:** Podobne ako pri degustáciách, bude možné rezervovať si pobyt v ubytovacích kapacitách vinárstva.
- **Synchronizácia dostupnosti:** Dostupnosť termínov sa bude automaticky synchronizovať s Bookio, aby sa predišlo dvojitým rezerváciám.

## 2. Technické riešenie (návrh)

Integrácia bude pravdepodobne prebiehať jedným z dvoch spôsobov, v závislosti od možností, ktoré poskytuje Bookio API:

### a) Vloženie widgetu (preferované)
- Ak Bookio poskytuje embeddable widget (vložiteľný prvok), tento bude vložený na dedikovanú stránku (`/degustacie`, `/ubytovanie`).
- Toto riešenie je rýchlejšie na implementáciu a menej náročné na údržbu, pretože celá logika rezervácie zostáva na strane Bookio.

### b) Vlastná integrácia cez API
- Ak widget nie je k dispozícii, bude potrebné vytvoriť vlastné rozhranie, ktoré bude komunikovať s Bookio API.
- Tento prístup je náročnejší, ale poskytuje plnú kontrolu nad vzhľadom a správaním rezervačného formulára.
- Vyžadovalo by si to vytvorenie nových Server Actions a Client Components na spracovanie výberu termínu, odoslanie rezervácie a zobrazenie potvrdenia.

## 3. Ďalšie kroky

1.  **Analýza Bookio API:** Zistiť, aké možnosti integrácie Bookio ponúka (dokumentácia, API kľúče, widgety).
2.  **Rozhodnutie o prístupe:** Na základe analýzy zvoliť vhodný spôsob integrácie.
3.  **Implementácia:** Vytvorenie potrebných stránok a komponentov v Next.js.
4.  **Testovanie:** Dôkladné otestovanie celého rezervačného procesu.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

Pre sprostredkovanie ubytovania využijeme externý rezervačný systém **Bookio**. Cieľom je poskytnúť zákazníkom možnosť rezervácie priamo na našom webe bez toho, aby sme museli vyvíjať a spravovať komplexný rezervačný systém.

## 1. Preferovaná Metóda: iFrame

Najrýchlejšou, najjednoduchšou a najmenej náročnou metódou integrácie je vloženie rezervačného widgetu od Bookio pomocou **iFrame**.

### Výhody:

- **Rýchla implementácia:** Stačí vložiť kúsok HTML kódu na stránku.
- **Žiadna údržba:** Všetka logika, dostupnosť, ceny a spracovanie rezervácií prebieha na strane Bookio. Nemusíme sa starať o aktualizácie.
- **Bezpečnosť:** Platby a citlivé údaje zákazníkov sú spracované priamo v zabezpečenom prostredí Bookio.

### Implementácia:

1.  **Získať kód:** Od Bookio získame HTML kód pre vloženie ich rezervačného widgetu.
2.  **Vytvoriť stránku:** Vytvoríme novú stránku v Next.js na adrese `/app/(pages)/ubytovanie/page.tsx`.
3.  **Vložiť iFrame:** Do tejto stránky vložíme poskytnutý kód.

    ```tsx
    // /app/(pages)/ubytovanie/page.tsx

    export default function UbytovaniePage() {
      return (
        <div className="container mx-auto py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Rezervácia Ubytovania</h1>
          <p className="text-center mb-8">Rezerváciu zabezpečuje náš partner Bookio.</p>
          
          <div className="w-full max-w-4xl mx-auto border rounded-lg overflow-hidden">
            <iframe
              src="https://ADRESA_WIDGETU_OD_BOOKIO"
              width="100%"
              height="800px" // Výšku prispôsobíme podľa potreby
              frameBorder="0"
              title="Rezervačný formulár Bookio"
            ></iframe>
          </div>
        </div>
      );
    }
    ```

4.  **Styling:** Prispôsobíme okolie iFrame tak, aby vizuálne zapadlo do dizajnu našej stránky.

## 2. Alternatívna Metóda: API Integrácia

Táto metóda by sa zvažovala iba v prípade, že Bookio poskytuje verejné API a iFrame riešenie by z nejakého dôvodu nevyhovovalo (napr. požiadavka na plne vlastný dizajn rezervačného procesu).

### Nevýhody:

- **Vysoká zložitosť:** Vyžaduje vývoj vlastného UI pre výber termínov, izieb, zadávanie údajov a spracovanie rezervácie.
- **Náročná údržba:** Akékoľvek zmeny v Bookio API by si vyžadovali úpravy na našej strane.
- **Bezpečnostné riziká:** Museli by sme bezpečne narábať s API kľúčmi a dátami.

**Záver:** Vzhľadom na ciele projektu je **iFrame integrácia jednoznačne odporúčaným a preferovaným riešením.**
