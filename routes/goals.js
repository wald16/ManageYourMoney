const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../server').db;

// Get all goals for a user
router.get('/', auth, async (req, res) => {
    try {
        const [goals] = await db.promise().query(
            'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(goals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
    try {
        const { name, target, type } = req.body;

        const [result] = await db.promise().query(
            'INSERT INTO goals (user_id, name, target, type) VALUES (?, ?, ?, ?)',
            [req.user.id, name, target, type]
        );

        const [newGoal] = await db.promise().query(
            'SELECT * FROM goals WHERE id = ?',
            [result.insertId]
        );

        res.json(newGoal[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // First check if the goal belongs to the user
        const [goal] = await db.promise().query(
            'SELECT * FROM goals WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (goal.length === 0) {
            return res.status(404).json({ msg: 'Goal not found' });
        }

        await db.promise().query('DELETE FROM goals WHERE id = ?', [id]);
        res.json({ msg: 'Goal deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 