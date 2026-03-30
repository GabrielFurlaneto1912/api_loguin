const express = require('express');
const router = express.Router();
const db = require('../db');

// GET em users
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar usuarios' });
        } else {
            return res.json(results);
        }
    });
});

module.exports = router;