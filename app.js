const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// 🖥️ Rota para abrir o dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// 🔗 Rotas da API
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');

app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);

module.exports = app;