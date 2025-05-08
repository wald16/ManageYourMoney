const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'finance_manager'
});

// Default categories for new users
const defaultCategories = [
    { name: 'Salary', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investments', type: 'income' },
    { name: 'Food', type: 'expense' },
    { name: 'Transportation', type: 'expense' },
    { name: 'Housing', type: 'expense' },
    { name: 'Utilities', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Shopping', type: 'expense' },
    { name: 'Healthcare', type: 'expense' }
];

// Register user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Start a transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }

            // Insert user
            const userQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
            db.query(userQuery, [username, email, hashedPassword], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        if (err.code === 'ER_DUP_ENTRY') {
                            return res.status(400).json({ message: 'Username or email already exists' });
                        }
                        return res.status(500).json({ message: 'Server error' });
                    });
                }

                const userId = results.insertId;

                // Insert default categories
                const categoryQuery = 'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)';
                let completedCategories = 0;

                defaultCategories.forEach(category => {
                    db.query(categoryQuery, [category.name, category.type, userId], (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Error creating default categories' });
                            });
                        }

                        completedCategories++;
                        if (completedCategories === defaultCategories.length) {
                            // All categories created successfully, commit the transaction
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ message: 'Error committing transaction' });
                                    });
                                }

                                const token = jwt.sign(
                                    { id: userId },
                                    process.env.JWT_SECRET || 'your_jwt_secret_key_here',
                                    { expiresIn: '1d' }
                                );

                                res.json({ token });
                            });
                        }
                    });
                });
            });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Server error' });

            if (results.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET || 'your_jwt_secret_key_here',
                { expiresIn: '1d' }
            );

            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 