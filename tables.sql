-- create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'business user',
  reset_password_token VARCHAR,
  reset_password_expires BIGINT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description VARCHAR,
  query VARCHAR,
  user_id INT,
  category_id INT DEFAULT 4,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create dummy table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  gender VARCHAR(1),
  birthday DATE,
  nationality VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- create favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id SERIAL PRIMARY KEY,
  user_id INT,
  report_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);