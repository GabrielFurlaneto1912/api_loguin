const express = require('express');
const app = express();

app.use(express.json());

//Rotas
const userRoutes = require('./routes/routes/user')
app.use ('/user', userRoutes);


module.exports = app;