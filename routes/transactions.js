const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'finance_manager'
});

// Get all transactions for a user
router.get('/', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    const query = `
    SELECT t.*, c.name as category_name 
    FROM transactions t 
    LEFT JOIN categories c ON t.category_id = c.id 
    WHERE t.user_id = ? 
    ORDER BY t.date DESC
  `;

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json(results);
    });
});

// Add new transaction
router.post('/', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { amount, description, date, category_id, type } = req.body;
    const userId = req.user.id;

    const query = `
    INSERT INTO transactions (amount, description, date, category_id, user_id, type)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(query, [amount, description, date, category_id, userId, type], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.json({ id: results.insertId, message: 'Transaction added successfully' });
    });
});

// Update transaction
router.put('/:id', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const { amount, description, date, category_id, type } = req.body;
    const userId = req.user.id;
    const transactionId = req.params.id;

    const query = `
    UPDATE transactions 
    SET amount = ?, description = ?, date = ?, category_id = ?, type = ?
    WHERE id = ? AND user_id = ?
  `;

    db.query(query, [amount, description, date, category_id, type, transactionId, userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction updated successfully' });
    });
});

// Delete transaction
router.delete('/:id', (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const userId = req.user.id;
    const transactionId = req.params.id;

    const query = 'DELETE FROM transactions WHERE id = ? AND user_id = ?';

    db.query(query, [transactionId, userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    });
});

module.exports = router; 