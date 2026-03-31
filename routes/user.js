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

const bcrypt = require('bcrypt');

// CRIAR usuário com senha
router.post('/', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    
    const sql = 'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)';

    db.query(sql, [nome, email, senha], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao criar usuário' });
        }

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            id: result.insertId
        });
    });
});

// DELETAR usuário
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM users WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ message: 'Usuário deletado com sucesso' });
    });
});

// ATUALIZAR usuário
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;

    const sql = 'UPDATE users SET nome = ?, email = ? WHERE id = ?';

    db.query(sql, [nome, email, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ message: 'Usuário atualizado com sucesso' });
    });
});

module.exports = router;