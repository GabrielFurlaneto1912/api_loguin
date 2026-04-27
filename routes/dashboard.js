const express = require('express');
const router = express.Router();
const db = require('../db');

// =========================
// 🥇 MELHOR VOLTA
// =========================
router.get('/melhor-volta', (req, res) => {
  db.query(
    `SELECT c.nome, MIN(v.tempo) AS melhor_volta
     FROM voltas v
     JOIN corredores c ON v.corredor_id = c.id`,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result[0] || {});
    }
  );
});

// =========================
// ⏳ TEMPO TOTAL
// =========================
router.get('/tempo-total', (req, res) => {
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

// =========================
// 🏆 RANKING
// =========================
router.get('/ranking', (req, res) => {
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