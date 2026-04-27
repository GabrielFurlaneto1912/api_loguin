const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// =========================
// 🔐 REGISTRO
// =========================
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    // Verificar se já existe
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor' });

      if (result.length > 0) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hash = await bcrypt.hash(senha, 10);

      db.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, hash],
        (err) => {
          if (err) return res.status(500).json({ error: 'Erro ao criar usuário' });

          res.status(201).json({ message: 'Usuário criado com sucesso!' });
        }
      );
    });

  } catch {
    res.status(500).json({ error: 'Erro inesperado' });
  }
});

// =========================
// 🔑 LOGIN
// =========================
router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha email e senha' });
  }

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const user = result[0];

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT não configurado' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login realizado!',
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email
      }
    });
  });
});

// =========================
// 👤 LISTAR USUÁRIOS
// =========================
router.get('/', (req, res) => {
  db.query('SELECT id, nome, email FROM usuarios', (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuários' });
    res.json(result);
  });
});

// =========================
// 🔍 BUSCAR POR ID
// =========================
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'SELECT id, nome, email FROM usuarios WHERE id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor' });

      if (result.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(result[0]);
    }
  );
});

// =========================
// ✏️ ATUALIZAR
// =========================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;

  const hash = senha ? await bcrypt.hash(senha, 10) : null;

  db.query(
    'UPDATE usuarios SET nome = ?, email = ?, senha = COALESCE(?, senha) WHERE id = ?',
    [nome, email, hash, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar' });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json({ message: 'Usuário atualizado' });
    }
  );
});

// =========================
// ❌ DELETAR
// =========================
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado' });
  });
});

module.exports = router;