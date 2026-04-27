const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT;

app.listen (port, () => {
console.log(`Servidor rodando em http://localhost:${port}`);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});