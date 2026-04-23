const express = require('express');
const app = express();

app.use(express.json());

// 📁 Importação correta das rotas
const userRoutes = require('./routes/routes/user');
// const dashboardRoutes = require('./routes/dashboard');

// 🚀 Uso das rotas
app.use('/users', userRoutes);
// app.use('/dashboard', dashboardRoutes);

module.exports = app;