-- ModifKan: skema database. Aman dijalankan ulang (DROP dulu, anak sebelum induk).
DROP TABLE IF EXISTS reviews, wishlist_items, addresses, cart_items, order_items, orders, products, categories, stores, sessions, users CASCADE;

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(20)  NOT NULL,
  avatar        TEXT,
  password_hash TEXT         NOT NULL,
  role          TEXT         NOT NULL CHECK (role IN ('admin','seller','buyer')),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  token      TEXT PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

CREATE TABLE stores (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER      NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  image       TEXT,
  status      TEXT         NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Nama kategori unik tanpa membedakan huruf besar/kecil ("Turbo" = "turbo").
CREATE UNIQUE INDEX idx_categories_name_lower ON categories (lower(name));

CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  store_id    INTEGER      NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  category_id INTEGER      NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name        VARCHAR(150) NOT NULL,
  description TEXT         NOT NULL,
  price       INTEGER      NOT NULL CHECK (price BETWEEN 1000 AND 1000000000),
  stock       INTEGER      NOT NULL CHECK (stock BETWEEN 0 AND 100000),
  image       TEXT         NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_category_id ON products(category_id);

CREATE TABLE cart_items (
  buyer_id   INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty        INTEGER     NOT NULL CHECK (qty > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (buyer_id, product_id)
);

CREATE TABLE orders (
  id                   SERIAL PRIMARY KEY,
  buyer_id             INTEGER REFERENCES users(id) ON DELETE SET NULL,
  store_id             INTEGER REFERENCES stores(id) ON DELETE SET NULL,
  status               TEXT    NOT NULL DEFAULT 'menunggu_pembayaran'
                       CHECK (status IN ('menunggu_pembayaran','diproses','dikirim','selesai','dibatalkan')),
  total                INTEGER NOT NULL CHECK (total >= 0),
  shipping_recipient   TEXT,
  shipping_phone       TEXT,
  shipping_address     TEXT,
  shipping_city        TEXT,
  shipping_postal_code TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER      NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   INTEGER      REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(150) NOT NULL,
  price        INTEGER      NOT NULL,
  qty          INTEGER      NOT NULL CHECK (qty > 0)
);

CREATE TABLE reviews (
  id            SERIAL PRIMARY KEY,
  order_item_id INTEGER     NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,
  product_id    INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  buyer_id      INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating        SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

CREATE TABLE wishlist_items (
  buyer_id   INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER     NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (buyer_id, product_id)
);

CREATE TABLE addresses (
  id          SERIAL PRIMARY KEY,
  buyer_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient   VARCHAR(100) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  address     TEXT         NOT NULL,
  city        VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10)  NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE INDEX idx_addresses_buyer_id ON addresses(buyer_id);
