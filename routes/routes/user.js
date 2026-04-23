const express = require('express');
const router = express.Router();
const db = require('../../db');


// =========================
// 👤 USUÁRIOS
// =========================

// GET usuários (sem senha)
router.get('/', (req, res) => {
    db.query('SELECT id, nome, email FROM usuarios', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar usuários' });
        }
        return res.json(results);
    });
});

// CRIAR usuário
router.post('/create', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';

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

// ATUALIZAR usuário
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    const sql = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?';

    db.query(sql, [nome, email, senha, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ message: 'Usuário atualizado com sucesso' });
    });
});

// DELETAR usuário
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({ message: 'Usuário deletado com sucesso' });
    });
});

// BUSCAR usuário por ID
router.get('/:id', (req, res) => {
    const { id } = req.params;

    db.query(
        'SELECT id, nome, email FROM usuarios WHERE id = ?',
        [id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erro ao buscar usuário' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            return res.json(results[0]);
        }
    );
});


// =========================
// 📊 DASHBOARD
// =========================

// 🥇 Melhor volta
router.get('/dashboard/melhor-volta', (req, res) => {
    db.query(
        `SELECT c.nome, MIN(v.tempo) AS melhor_volta
         FROM voltas v
         JOIN corredores c ON v.corredor_id = c.id`,
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result[0]);
        }
    );
});

// ⏳ Tempo total
router.get('/dashboard/tempo-total', (req, res) => {
    db.query(
        `SELECT c.nome, SUM(v.tempo) AS tempo_total
         FROM voltas v
         JOIN corredores c ON v.corredor_id = c.id
         GROUP BY c.id`,
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

// 🏆 Ranking
router.get('/dashboard/ranking', (req, res) => {
    db.query(
        `SELECT c.nome, SUM(v.tempo) AS total
         FROM voltas v
         JOIN corredores c ON v.corredor_id = c.id
         GROUP BY c.id
         ORDER BY total ASC`,
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});


module.exports = router;