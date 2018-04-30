const mysql = require('mysql');

const masterConn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'log_master',
});

const slaveConn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'log_slave',
});

masterConn.connect();
slaveConn.connect();

module.exports = {
  masterConn, slaveConn,
};
