-- create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'business user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create query_reports table
CREATE TABLE IF NOT EXISTS query_reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR,
  query VARCHAR,
  user_id INT,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
