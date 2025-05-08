-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    category_id INT,
    user_id INT,
    type ENUM('income', 'expense') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de presupuestos
CREATE TABLE IF NOT EXISTS budgets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    user_id INT,
    amount DECIMAL(10,2) NOT NULL,
    month DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar categorías por defecto para cada usuario
INSERT INTO categories (name, type, user_id)
SELECT 'Salary', 'income', id FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.user_id = users.id 
    AND categories.name = 'Salary'
);

INSERT INTO categories (name, type, user_id)
SELECT 'Freelance', 'income', id FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.user_id = users.id 
    AND categories.name = 'Freelance'
);

INSERT INTO categories (name, type, user_id)
SELECT 'Food', 'expense', id FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.user_id = users.id 
    AND categories.name = 'Food'
);

INSERT INTO categories (name, type, user_id)
SELECT 'Transportation', 'expense', id FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.user_id = users.id 
    AND categories.name = 'Transportation'
);

INSERT INTO categories (name, type, user_id)
SELECT 'Utilities', 'expense', id FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.user_id = users.id 
    AND categories.name = 'Utilities'
);

INSERT INTO categories (name, type, user_id)
SELECT 'Entertainment', 'expense', id FROM users
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.user_id = users.id 
    AND categories.name = 'Entertainment'
); 