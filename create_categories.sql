USE finance_manager;

-- Create categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default categories for all users
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