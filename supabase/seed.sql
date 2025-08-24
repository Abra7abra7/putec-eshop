-- Add a test product for Vinárstvo Pútec
INSERT INTO
  public.products (id, active, name, description, image, metadata)
VALUES
  (
    'prod_test_frankovka',
    true,
    'Pútec Frankovka Modrá',
    'Suché červené víno s tónmi čerešní a jemnou korenistou dochuťou. Ideálne k tmavému mäsu a syrom.',
    '/images/frankovka-modra.jpg',
    '{"index": 0}'
  );

-- Add a price for the test product
INSERT INTO
  public.prices (
    id,
    product_id,
    active,
    description,
    unit_amount,
    currency,
    type,
    "interval",
    interval_count,
    trial_period_days,
    metadata
  )
VALUES
  (
    'price_test_frankovka',
    'prod_test_frankovka',
    true,
    'Cena za fľašu',
    1250,
    'eur',
    'one_time',
    null,
    null,
    null,
    '{}'
  );
