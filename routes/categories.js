const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'finance_manager'
});

// Get all categories for a user
router.get('/', (req, res) => {
    console.log('GET /categories - User:', req.user);

    if (!req.user || !req.user.id) {
        console.log('No user found in request');
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    console.log('Fetching categories for user ID:', userId);

    const query = 'SELECT * FROM categories WHERE user_id = ? ORDER BY name';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        console.log('Categories found:', results);
        res.json(results);
    });
});

// Add new category
router.post('/', (req, res) => {
    console.log('POST /categories - Request body:', req.body);
    console.log('User:', req.user);

    if (!req.user || !req.user.id) {
        console.log('No user found in request');
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, type } = req.body;
    const userId = req.user.id;
    console.log('Adding category for user ID:', userId);

    const query = 'INSERT INTO categories (name, type, user_id) VALUES (?, ?, ?)';

    db.query(query, [name, type, userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error' });
        }
        console.log('Category added successfully:', results);
        res.json({ id: results.insertId, message: 'Category added successfully' });
    });
});

// Update category
router.put('/:id', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, type } = req.body;
    const userId = req.user.id;
    const categoryId = req.params.id;

    const query = 'UPDATE categories SET name = ?, type = ? WHERE id = ? AND user_id = ?';

    db.query(query, [name, type, categoryId, userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully' });
    });
});

// Delete category
router.delete('/:id', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    const categoryId = req.params.id;

    const query = 'DELETE FROM categories WHERE id = ? AND user_id = ?';

    db.query(query, [categoryId, userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    });
});

module.exports = router; 