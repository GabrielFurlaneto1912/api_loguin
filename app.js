const mysql = require('mysql2');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'corrida_db',
  port: 3306
});

db.getConnection((err, conn) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Banco conectado!');
    conn.release();
  }
});

module.exports = db;