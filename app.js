const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// rotas
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');

app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);

module.exports = app;