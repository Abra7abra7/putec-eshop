# Integrácia Rezervačného Systému (Bookio)

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
