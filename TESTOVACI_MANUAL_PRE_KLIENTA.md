# Manuál na Testovanie Webu: Vinárstvo Pútec

Vážený klient,

tento dokument slúži ako sprievodca pre kompletné otestovanie funkčnosti vášho nového webu. Prosím, prejdite si jednotlivé kroky a v prípade, že narazíte na akýkoľvek problém, zaznamenajte ho podľa inštrukcií na konci tohto manuálu.

**Adresa webu:** [https://vasa-finalna-domena.sk](https://vasa-finalna-domena.sk) (doplňte finálnu URL)

---

## 1. Vizuálna kontrola a základná navigácia

Cieľom je overiť, či sa všetky stránky zobrazujú správne, texty sú bez chýb a obrázky sa načítavajú.

- [ ] **Hlavná stránka:** Skontrolujte všetky texty, obrázky a propagačné sekcie.
- [ ] **Navigácia v menu:** Preklikajte sa všetkými položkami v hlavnom menu (`O nás`, `Vína`, `Kontakt` atď.).
- [ ] **Pätička stránky:** Overte všetky odkazy a informácie v pätičke (kontaktné údaje, sociálne siete, odkaz na ochranu osobných údajov).
- [ ] **Responzivita:** Zobrazte web na rôznych zariadeniach:
  - **Počítač:** Štandardné zobrazenie.
  - **Mobilný telefón:** Zobrazte stránku na mobile. Skontrolujte, či sa menu správne zmenilo na "hamburger" ikonku a či je obsah dobre čitateľný a ovládateľný.

---

## 2. Funkčnosť E-shopu

Najdôležitejšia časť testovania. Prejdeme si celý nákupný proces od výberu vína až po fiktívnu platbu.

### A. Prezeranie produktov a košík

- [ ] **Zoznam produktov:** Prejdite na stránku "Vína". Skontrolujte, či sa zobrazujú všetky produkty správne.
- [ ] **Detail produktu:** Kliknite na niekoľko rôznych vín. Overte všetky detaily: názov, popis, ročník, cenu a obrázky.
- [ ] **Pridanie do košíka:** Pridajte jedno víno do košíka. Overte, či sa ikona košíka aktualizovala.
- [ ] **Úprava košíka:**
  - Otvorte košík.
  - Zmeňte počet kusov pri produkte.
  - Pridajte do košíka ďalší produkt.
  - Odstráňte jeden produkt z košíka.
  - Pri každom kroku overte, či sa **celková suma správne prepočítala**.

### B. Testovací nákup (Objednávka)

Tento krok simuluje reálnu objednávku pomocou **testovacích platobných kariet**. Tieto transakcie sú fiktívne a nebudú vám účtované žiadne poplatky.

- [ ] **Prechod do pokladne:** V košíku kliknite na tlačidlo na dokončenie objednávky (napr. "Pokladňa" alebo "Pokračovať").
- [ ] **Vyplnenie údajov:** Vyplňte všetky požadované fakturačné a dodacie údaje.
- [ ] **Výber platby:** Zvoľte platbu kartou.
- [ ] **Presmerovanie na Stripe:** Mali by ste byť presmerovaný na zabezpečenú platobnú bránu Stripe.
- [ ] **Zadanie testovacej karty:** Do platobného formulára zadajte údaje jednej z nasledujúcich testovacích kariet:
  - **Číslo karty:** `4242 4242 4242 4242`
  - **Dátum expirácie:** Akýkoľvek dátum v budúcnosti (napr. `12/25`)
  - **CVC kód:** Akékoľvek 3 číslice (napr. `123`)
  - **Meno na karte:** Akékoľvek meno (napr. `Testovací Zákazník`)
- [ ] **Potvrdenie platby:** Dokončite platbu.
- [ ] **Stránka s potvrdením:** Po úspešnej platbe by ste mali byť presmerovaný späť na web, na stránku s poďakovaním a potvrdením objednávky.
- [ ] **Potvrdzujúci e-mail:** Skontrolujte si svoju e-mailovú schránku. Mali by ste dostať e-mail s potvrdením objednávky.

---

## 3. Používateľský účet

- [ ] **Registrácia:** Vytvorte si nový používateľský účet.
- [ ] **Prihlásenie / Odhlásenie:** Po registrácii sa skúste odhlásiť a znova prihlásiť.
- [ ] **Zákaznícka zóna:** Po prihlásení skontrolujte, či vidíte sekciu "Môj účet" alebo podobnú.
- [ ] **História objednávok:** V zákazníckej zóne overte, či vidíte svoju testovaciu objednávku, ktorú ste práve vykonali.

---

## 4. Dopyty na zážitky (Degustácie/Ubytovanie)

- [ ] **Zobrazenie zážitkov:** Prejdite na stránku, kde sú ponúkané zážitky.
- [ ] **Odoslanie dopytu:** Vyplňte a odošlite formulár pre nezáväzný dopyt.
- [ ] **Potvrdenie odoslania:** Overte, či sa po odoslaní zobrazila správa o úspešnom odoslaní dopytu.

---

## Ako hlásiť chyby a problémy

Ak narazíte na akýkoľvek problém, prosím, pošlite nám e-mail s nasledujúcimi informáciami. Čím viac detailov poskytnete, tým rýchlejšie budeme môcť problém opraviť.

1.  **Názov stránky:** Na ktorej stránke sa problém vyskytol (napr. `Košík`, `Detail produktu: Rizling rýnsky`).
2.  **Popis krokov:** Čo presne ste robili, kým sa chyba objavila?
3.  **Očakávaný výsledok:** Čo ste očakávali, že sa stane?
4.  **Skutočný výsledok:** Čo sa namiesto toho stalo?
5.  **Screenshot (snímka obrazovky):** Ak je to možné, priložte aj obrázok chyby. Pomôže to najviac.

Ďakujeme vám za spoluprácu pri testovaní!
