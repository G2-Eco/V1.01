-- Indexes pour users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Indexes pour products
CREATE INDEX idx_products_item_name ON products(item_name);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_products_initial_price ON products(initial_price);
CREATE INDEX idx_products_categories ON products(categories(255));

-- Indexes pour refresh_tokens
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);