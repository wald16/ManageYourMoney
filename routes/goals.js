const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');

// Get all goals for a user
router.get('/', auth, async (req, res) => {
    try {
        db.query(
            'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id],
            (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Server Error');
                }
                res.json(results);
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
    try {
        const { name, target, type } = req.body;
        db.query(
            'INSERT INTO goals (user_id, name, target, type) VALUES (?, ?, ?, ?)',
            [req.user.id, name, target, type],
            (err, result) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Server Error');
                }
                db.query(
                    'SELECT * FROM goals WHERE id = ?',
                    [result.insertId],
                    (err, results) => {
                        if (err) {
                            console.error(err.message);
                            return res.status(500).send('Server Error');
                        }
                        res.json(results[0]);
                    }
                );
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        db.query(
            'SELECT * FROM goals WHERE id = ? AND user_id = ?',
            [id, req.user.id],
            (err, results) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Server Error');
                }
                if (results.length === 0) {
                    return res.status(404).json({ msg: 'Goal not found' });
                }
                db.query('DELETE FROM goals WHERE id = ?', [id], (err) => {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).send('Server Error');
                    }
                    res.json({ msg: 'Goal deleted' });
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 