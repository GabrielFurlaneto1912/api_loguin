const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'corrida_db',
  port: 3306,
  connectTimeout: 10000
});

db.getConnection((err, conn) => {
  if (err) {
    console.error('ERRO DETALHADO:', err);
  } else {
    console.log('Banco conectado!');
    conn.release();
  }
});

module.exports = db;