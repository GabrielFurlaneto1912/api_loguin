const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'corrida_db',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.log('❌ ERRO REAL:');
    console.log(err);
  } else {
    console.log('✅ CONECTOU!');
  }
});
