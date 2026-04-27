const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =========================
// 🔐 REGISTRO
// =========================
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  const hash = await bcrypt.hash(senha, 10);

  db.query(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, hash],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(201).json({ message: 'Usuário criado!' });
    }
  );
});

// =========================
// 🔑 LOGIN COM TOKEN
// =========================
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const user = result[0];

      const senhaValida = await bcrypt.compare(senha, user.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.json({
        message: 'Login realizado!',
        token
      });
    }
  );
});

module.exports = router;