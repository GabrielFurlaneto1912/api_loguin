const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'corrida_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Banco conectado!');
});

module.exports = db;