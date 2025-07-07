# Schéma Databázy (Supabase - PostgreSQL)

Nasledujúca schéma je navrhnutá pre flexibilitu a škálovateľnosť. Všetky `id` stĺpce sú typu `UUID` a generované pomocou `gen_random_uuid()`. Všetky tabuľky obsahujú `created_at` a `updated_at` stĺpce pre sledovanie zmien.

## Tabuľka: `products`

Ukladá informácie o všetkých predajných produktoch (vína, príslušenstvo).

| Názov stĺpca | Typ | Popis a obmedzenia |
| --- | --- | --- |
| `id` | `uuid` | **Primárny kľúč.** |
| `created_at` | `timestamptz` | Dátum vytvorenia záznamu. `DEFAULT now()` |
| `updated_at` | `timestamptz` | Dátum poslednej úpravy. `DEFAULT now()` |
| `name` | `text` | Názov produktu. `NOT NULL` |
| `description` | `text` | Senzorický a marketingový popis. |
| `price` | `numeric(10, 2)` | Cena za jednotku v EUR. `NOT NULL`, `CHECK (price >= 0)` |
| `stock` | `integer` | Počet kusov na sklade. `NOT NULL`, `DEFAULT 0` |
| `sku` | `text` | Skladová jednotka. `UNIQUE`, `NOT NULL` |
| `image_url` | `text` | Odkaz na hlavný obrázok v Supabase Storage. |
| `gallery_urls` | `text[]` | Pole odkazov na ďalšie obrázky. |
| `is_active` | `boolean` | Či je produkt aktívne v ponuke. `NOT NULL`, `DEFAULT true` |
| `category_id` | `uuid` | Cudzí kľúč na `categories.id`. |
| `year` | `integer` | Ročník vína (pre vína). |
| `wine_region` | `text` | Vinohradnícka oblasť (pre vína). |
| `alcohol_percentage` | `numeric(4, 1)` | Obsah alkoholu (pre vína). |
| `attributes` | `jsonb` | Ostatné špecifické údaje (viď príklad nižšie). |

**Príklad `attributes` pre víno:**
```json
{
  "origin_designation": "Víno s chráneným označením pôvodu",
  "classification_details": "Akostné, biele, polosuché",
  "contains_sulfites": true,
  "batch_number": "L.23",
  "filling_date": "2025-02",
  "acids_g_per_l": 6.6,
  "residual_sugar_g_per_l": 10,
  "grape_sugar_nm": 22,
  "storage_temp_c": "10-12 °C",
  "serving_temp_c": "10-12 °C",
  "country_of_origin": "Slovensko",
  "producer": "Pútec s.r.o. Pezinská 154, Vinosady 902 01",
  "bottler": "Pútec s.r.o. Pezinská 154, Vinosady 902 01",
  "ean_url": "https://eanonline.gs1sk.org/01/08582000037412"
}
```

## Tabuľka: `categories`

Číselník kategórií pre produkty (Biele víno, Červené víno, Príslušenstvo...).

| Názov stĺpca | Typ | Popis a obmedzenia |
| --- | --- | --- |
| `id` | `uuid` | **Primárny kľúč.** |
| `name` | `text` | Názov kategórie. `NOT NULL`, `UNIQUE` |
| `slug` | `text` | Unikátny reťazec pre URL. `NOT NULL`, `UNIQUE` |
| `parent_id` | `uuid` | Cudzí kľúč na `categories.id` (pre podkategórie). `NULLABLE` |

## Tabuľka: `experiences`

Ukladá informácie o degustáciách a piknikových košoch.

| Názov stĺpca | Typ | Popis a obmedzenia |
| --- | --- | --- |
| `id` | `uuid` | **Primárny kľúč.** |
| `name` | `text` | Názov balíka. `NOT NULL` |
| `slug` | `text` | Unikátny reťazec pre URL. `NOT NULL`, `UNIQUE` |
| `type` | `enum('tasting', 'picnic')` | Typ zážitku. `NOT NULL` |
| `description` | `text` | Marketingový popis. |
| `base_price` | `numeric(10, 2)` | Základná cena balíka. |
| `image_url` | `text` | Odkaz na prezentačný obrázok. |
| `is_active` | `boolean` | Či je zážitok aktívne v ponuke. `NOT NULL`, `DEFAULT true` |
| `attributes` | `jsonb` | Špecifické detaily balíka (viď príklady v zadaní). |

## Tabuľka: `inquiries`

Ukladá dopyty na zážitky.

| Názov stĺpca | Typ | Popis a obmedzenia |
| --- | --- | --- |
| `id` | `uuid` | **Primárny kľúč.** |
| `experience_id` | `uuid` | Cudzí kľúč na `experiences.id`. `NOT NULL` |
| `customer_name` | `text` | Meno zákazníka. `NOT NULL` |
| `customer_email` | `text` | Email zákazníka. `NOT NULL` |
| `customer_phone` | `text` | Telefón zákazníka. `NOT NULL` |
| `requested_date` | `date` | Požadovaný dátum. |
| `requested_time` | `text` | Požadovaný čas. |
| `number_of_people` | `integer` | Požadovaný počet osôb. `CHECK (number_of_people > 0)` |
| `message` | `text` | Doplňujúca správa od zákazníka. |
| `status` | `enum('new', 'contacted', 'confirmed', 'closed')` | Stav dopytu. `NOT NULL`, `DEFAULT 'new'` |

## Tabuľky: `orders` a `order_items`

Štruktúra pre ukladanie objednávok.

### `orders`
| Názov stĺpca | Typ | Popis |
| --- | --- | --- |
| `id` | `uuid` | **Primárny kľúč.** |
| `user_id` | `uuid` | Cudzí kľúč na `auth.users` (ak je zákazník prihlásený). |
| `total_price` | `numeric(10, 2)` | Celková suma objednávky. |
| `status` | `enum('pending', 'paid', 'cod', 'shipped', 'completed', 'canceled')` | Stav objednávky. |
| `payment_method`| `enum('stripe', 'cod')` | Platobná metóda. |
| `customer_details`| `jsonb` | Údaje o zákazníkovi (meno, adresa, firma...). |
| `shipping_details`| `jsonb` | Údaje o doručení. |

### `order_items`
| Názov stĺpca | Typ | Popis |
| --- | --- | --- |
| `id` | `uuid` | **Primárny kľúč.** |
| `order_id` | `uuid` | Cudzí kľúč na `orders.id`. `NOT NULL` |
| `product_id` | `uuid` | Cudzí kľúč na `products.id`. `NOT NULL` |
| `quantity` | `integer` | Počet kusov. `NOT NULL` |
| `price_per_unit`| `numeric(10, 2)`| Cena za kus v čase objednávky. `NOT NULL` |
