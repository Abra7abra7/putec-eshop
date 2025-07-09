# Dizajn a Vizuálny Štýl

Celkový dizajn projektu je postavený na princípoch minimalizmu, čistoty a responzivity. Cieľom je poskytnúť príjemný a intuitívny používateľský zážitok na všetkých zariadeniach.

## 1. Technologický základ

- **[Tailwind CSS](https://tailwindcss.com):** Ako primárny CSS framework bol zvolený Tailwind CSS. Jeho "utility-first" prístup umožňuje rýchlo vytvárať komplexné a konzistentné rozhrania priamo v HTML (JSX) kóde. Všetky farby, písma a medzery sú definované v konfiguračnom súbore `tailwind.config.ts`, čo zaručuje jednotný vzhľad naprieč celou aplikáciou.

- **[Shadcn/UI](https://ui.shadcn.com/):** Na Tailwind CSS je postavená knižnica komponentov Shadcn/UI. Nejde o tradičnú knižnicu, ale o kolekciu predpripravených, plne prispôsobiteľných a dostupných (accessible) React komponentov. Do projektu sa nekopíruje celá knižnica, ale iba konkrétne komponenty, ktoré potrebujeme (napr. `Button`, `Card`, `Dialog`). Tieto komponenty sú uložené v adresári `/components/ui` a môžeme ich ľubovoľne upravovať.

## 2. Kľúčové prvky dizajnu

- **Farebná paleta:** Paleta je inšpirovaná identitou vinárstva. Dominujú v nej zemité tóny, doplnené o akcentovú farbu pre dôležité prvky (tlačidlá, odkazy).
- **Typografia:** Používa sa moderné a dobre čitateľné bezpätkové písmo (napr. Inter), ktoré je načítavané pomocou `next/font` pre optimálny výkon.
- **Responzivita:** Všetky komponenty a stránky sú plne responzívne. Rozloženie sa plynule prispôsobuje rôznym veľkostiam obrazoviek, od mobilných telefónov až po veľké monitory. Zvláštna pozornosť bola venovaná mobilnej navigácii (`MobileNav.tsx`).
- **Ikonografia:** Pre ikony sa využíva knižnica `lucide-react`, ktorá ponúka širokú škálu čistých a konzistentných ikon.

---
*Posledná aktualizácia: 2025-07-09 12:54:46*

## 1. Filozofia Dizajnu

Dizajn e-shopu bude postavený na princípoch minimalizmu, elegancie a prehľadnosti. Cieľom je vytvoriť prémiový vizuálny zážitok, ktorý odráža kvalitu ponúkaných vín a služieb. Dôraz kladieme na vysokú čitateľnosť, intuitívnu navigáciu a vizuálnu konzistentnosť naprieč celou aplikáciou.

## 2. Farebná Paleta

| Účel | Farba | Hex Kód | Popis |
| --- | --- | --- | --- |
| **Primárne pozadie** | Biela | `#FFFFFF` | Hlavná farba pozadia pre čistý a svieži vzhľad. |
| **Sekundárne pozadie** | Krémová biela | `#FDFDFD` | Jemný odtieň pre oddelenie sekcií bez tvrdých liniek. |
| **Akcentová farba** | Zlato-piesková | `#D4AF37` | Použitá na tlačidlá, dôležité odkazy a kľúčové prvky. Symbolizuje luxus a kvalitu. |
| **Hlavný text** | Tmavosivá | `#333333` | Zabezpečuje vysoký kontrast a vynikajúcu čitateľnosť. |
| **Sekundárny text** | Svetlosivá | `#666666` | Pre menej dôležité informácie, ako sú popisy alebo metadáta. |
| **Stav úspechu** | Zelená | `#28a745` | Pre notifikácie o úspešných akciách. |
| **Stav chyby** | Červená | `#dc3545` | Pre chybové hlášky a upozornenia. |

## 3. Typografia

Výber písma je kľúčový pre dosiahnutie elegantného vzhľadu.

- **Nadpisy (`h1`, `h2`, `h3`):** **Cormorant Garamond** (Google Fonts) - Serifové písmo, ktoré pôsobí klasicky a sofistikovane.
- **Odstavce a bežný text:** **Lora** (Google Fonts) - Dobre čitateľné serifové písmo, ktoré sa hodí k nadpisom a je príjemné na čítanie dlhších textov.
- **Alternatíva (bezserifové):** **Lato** alebo **Inter** pre moderný a čistý vzhľad, ak by serifové písmo nevyhovovalo.

## 4. Používateľské Rozhranie (UI) a Použiteľnosť (UX)

- **Responzivita:** Dizajn bude plne responzívny (`mobile-first`) a optimalizovaný pre všetky typy zariadení (mobil, tablet, desktop).
- **Interaktívne prvky:** Všetky tlačidlá, odkazy a formulárové polia budú mať jasne definované stavy `:hover`, `:focus`, a `:active`, aby používateľ vždy vedel, s čím interaguje.
- **Ikonografia:** Použijeme sadu ikon **Lucide React**, ktorá je už v projekte, pre konzistentný a čistý vzhľad ikon.
- **Layout:** Použijeme mriežkový systém (grid) pre usporiadanie prvkov, čo zabezpečí vizuálnu harmóniu a poriadok.
- **Biele miesto (Whitespace):** Hojné využívanie bieleho miesta pomôže oddeliť obsah, zlepší čitateľnosť a dodá dizajnu vzdušnosť.
