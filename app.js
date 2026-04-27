const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Carrega as variáveis do .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir o arquivo HTML estático (dashboard.html)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Importar Rotas (Exemplo baseado na sua pasta 'routes')
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

app.use('/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// EXPORTAR O APP (Isso resolve o erro do listen)
module.exports = app;