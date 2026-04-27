const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// IMPORTA ROTA
const usuariosRoutes = require('./routes/usuarios');

// PREFIXO DA API
app.use('/usuarios', usuariosRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});