const app = require('./app'); // Importa o arquivo app.js acima
const port = process.env.PORT || 3000;

// Agora o app.listen funcionará porque o 'app' foi exportado corretamente
app.listen(port, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`-----------------------------------------`);
});