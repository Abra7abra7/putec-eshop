# Aktuálna Schéma Databázy (Supabase - PostgreSQL)

Toto je aktuálna štruktúra databázy projektu Vinárstvo Pútec. Databáza je navrhnutá tak, aby podporovala predaj produktov, správu zážitkov (degustácie, ubytovanie) a evidenciu dopytov od zákazníkov.

## Tabuľka: `products`
Ukladá všetky detailné informácie o produktoch (vínach).

| Stĺpec | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | `uuid` | Áno | Primárny kľúč (PK). |
| `name` | `text` | Áno | Názov vína. |
| `slug` | `text` | Nie | URL-friendly verzia názvu. |
| `description` | `text` | Nie | Podrobný marketingový popis. |
| `price` | `numeric` | Áno | Cena za jednotku. |
| `stock` | `integer` | Áno | Počet kusov na sklade. |
| `sku` | `text` | Áno | Unikátny kód produktu (Stock Keeping Unit). |
| `ean` | `text` | Nie | Európsky kód tovaru (čiarový kód). |
| `image_url` | `text` | Nie | URL hlavného obrázku produktu. |
| `gallery_urls` | `text[]` | Nie | Pole URL adries pre galériu obrázkov. |
| `is_active` | `boolean` | Áno | Určuje, či je produkt aktívny a viditeľný v e-shope. |
| `category_id` | `uuid` | Nie | Odkaz na tabuľku `categories` (cudzí kľúč, FK). |
| `rocnik` / `year` | `integer` | Nie | Ročník vína. |
| `wine_region` | `text` | Nie | Vinohradnícka oblasť pôvodu. |
| `alcohol_percentage`| `numeric` | Nie | Percentuálny obsah alkoholu. |
| `farba_vina` | `text` | Nie | Farba vína (napr. "Biele"). |
| `zvyskovy_cukor` | `text` | Nie | Klasifikácia podľa zvyškového cukru (napr. "Suché"). |
| `vona` | `text` | Nie | Popis vône vína. |
| `chut` | `text` | Nie | Popis chuti vína. |
| `farba_popis` | `text` | Nie | Slovný popis farby vína. |
| `attributes` | `jsonb` | Nie | Flexibilné pole pre ďalšie atribúty (napr. ocenenia). |
| `created_at` | `timestamptz` | Áno | Čas vytvorenia záznamu. |
| `updated_at` | `timestamptz` | Áno | Čas poslednej aktualizácie záznamu. |

## Tabuľka: `categories`
Kategorizácia produktov (biele, červené, ružové) s možnosťou vnorenia.

| Stĺpec | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | `uuid` | Áno | Primárny kľúč (PK). |
| `name` | `text` | Áno | Názov kategórie. |
| `slug` | `text` | Áno | URL-friendly verzia názvu. |
| `parent_id` | `uuid` | Nie | Odkaz na nadradenú kategóriu (pre vnorenie). |
| `created_at` | `timestamptz` | Áno | Čas vytvorenia záznamu. |
| `updated_at` | `timestamptz` | Áno | Čas poslednej aktualizácie záznamu. |

## Tabuľka: `orders`
Ukladá informácie o objednávkach zákazníkov.

| Stĺpec | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | `uuid` | Áno | Primárny kľúč (PK). |
| `user_id` | `uuid` | Nie | Odkaz na používateľa v tabuľke `auth.users` (FK). |
| `total_price` | `numeric` | Áno | Celková cena objednávky. |
| `status` | `enum` | Áno | Stav objednávky ('pending', 'paid', 'shipped', 'cancelled'). |
| `payment_method`| `enum` | Áno | Použitá platobná metóda ('card', 'transfer'). |
| `customer_details`| `jsonb` | Áno | Fakturačné a kontaktné údaje zákazníka. |
| `shipping_details`| `jsonb` | Nie | Dodacie údaje (ak sú iné ako fakturačné). |
| `stripe_session_id`|`text` | Nie | ID platobnej relácie zo Stripe. |
| `created_at` | `timestamptz` | Áno | Čas vytvorenia záznamu. |
| `updated_at` | `timestamptz` | Áno | Čas poslednej aktualizácie záznamu. |

## Tabuľka: `order_items`
Položky patriace ku konkrétnej objednávke.

| Stĺpec | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | `uuid` | Áno | Primárny kľúč (PK). |
| `order_id` | `uuid` | Áno | Odkaz na tabuľku `orders` (FK). |
| `product_id` | `uuid` | Áno | Odkaz na tabuľku `products` (FK). |
| `quantity` | `integer` | Áno | Počet kusov produktu. |
| `price_per_unit`| `numeric` | Áno | Cena za kus v čase objednávky. |
| `created_at` | `timestamptz` | Áno | Čas vytvorenia záznamu. |

## Tabuľka: `experiences`
Ukladá informácie o ponúkaných zážitkoch (degustácie, ubytovanie).

| Stĺpec | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | `uuid` | Áno | Primárny kľúč (PK). |
| `name` | `text` | Áno | Názov zážitku. |
| `slug` | `text` | Áno | URL-friendly verzia názvu. |
| `type` | `enum` | Áno | Typ zážitku ('tasting', 'accommodation'). |
| `description` | `text` | Nie | Podrobný popis zážitku. |
| `base_price` | `numeric` | Nie | Základná cena (napr. na osobu). |
| `image_url` | `text` | Nie | URL hlavného obrázku. |
| `is_active` | `boolean` | Áno | Určuje, či je zážitok aktívne ponúkaný. |
| `attributes` | `jsonb` | Nie | Flexibilné pole pre ďalšie detaily (napr. kapacita). |
| `created_at` | `timestamptz` | Áno | Čas vytvorenia záznamu. |
| `updated_at` | `timestamptz` | Áno | Čas poslednej aktualizácie záznamu. |

## Tabuľka: `inquiries`
Evidencia dopytov od zákazníkov na konkrétne zážitky.

| Stĺpec | Typ | Povinné | Popis |
|---|---|---|---|
| `id` | `uuid` | Áno | Primárny kľúč (PK). |
| `experience_id` | `uuid` | Áno | Odkaz na tabuľku `experiences` (FK). |
| `customer_name` | `text` | Áno | Meno zákazníka. |
| `customer_email`| `text` | Áno | E-mail zákazníka. |
| `customer_phone`| `text` | Áno | Telefónne číslo zákazníka. |
| `requested_date`| `date` | Nie | Požadovaný dátum konania. |
| `requested_time`| `text` | Nie | Požadovaný čas konania. |
| `number_of_people`|`integer`| Nie | Počet osôb. |
| `message` | `text` | Nie | Správa od zákazníka. |
| `status` | `enum` | Áno | Stav dopytu ('new', 'contacted', 'confirmed', 'closed'). |
| `created_at` | `timestamptz` | Áno | Čas vytvorenia záznamu. |
| `updated_at` | `timestamptz` | Áno | Čas poslednej aktualizácie záznamu. |

---
*Posledná aktualizácia: 2025-07-09 13:14:00*
