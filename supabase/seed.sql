-- Seed data pre wine eshop

-- 1. Kategórie vín
INSERT INTO wine_categories (name, color) VALUES
  ('Biele víno', '#F4E4BC'),
  ('Červené víno', '#722F37'),
  ('Ružové víno', '#E8B4B8'),
  ('Perlivé víno', '#F0F8FF');

-- 2. Test víno - Pálava biele polosuché 2024
INSERT INTO products (
  id,
  active,
  name,
  description,
  image,
  metadata,
  wine_category_id,
  vintage,
  region,
  alcohol_content,
  sweetness_level,
  gs1_code,
  stock_quantity
) VALUES (
  'prod_palava_white_2024',
  true,
  'Pálava biele polosuché 2024',
  'Víno s iskrivou zlato-žltou farbou, s expresívnou vôňou pomarančovej kôry a sušených marhúľ, postupne prechádza do medovo-ovocnej chuti, plnej broskýň, byliniek a jemného tymiánu.',
  'https://via.placeholder.com/400x300/F4E4BC/722F37?text=Palava+White+2024',
  '{"color": "Iskrivá zlato-žltá farba", "taste": "Medovo-ovocná chuť, plná broskýň, byliniek a jemného tymiánu", "aroma": "Expresívna pomarančová kôra a sušené marhule"}',
  (SELECT id FROM wine_categories WHERE name = 'Biele víno'),
  2024,
  'Pálava',
  12.0,
  'polosuché',
  '08582000037412',
  100
);

-- 3. Cena pre víno
INSERT INTO prices (
  id,
  product_id,
  active,
  description,
  unit_amount,
  currency,
  type,
  metadata
) VALUES (
  'price_palava_white_2024',
  'prod_palava_white_2024',
  true,
  'Cena za fľašu 0.75L',
  1190,
  'eur',
  'one_time',
  '{}'
);
