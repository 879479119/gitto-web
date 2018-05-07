
const { masterConn, slaveConn } = require('./database');

module.exports = {
  queryTypes() {
    return new Promise((resolve, reject) => {
      masterConn.query('SELECT * FROM log_type', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },
  querySubTypes() {
    return new Promise((resolve, reject) => {
      masterConn.query('SELECT * FROM log_subtype', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },

  insertLogInfo(table, columns, values) {
    console.info(values);
    return new Promise((resolve, reject) => {
      console.info(`INSERT INTO ${table} (${columns.join()}) VALUES ${values.map(v => `( ${formatValus(v)} )`).join()}`)
      slaveConn.query(`INSERT INTO ${table} (${columns.join()}) VALUES ${values.map(v => `( ${formatValus(v)} )`).join()}`, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  },
};

function formatValus(values) {
  return values.map((v) => {
    if (v === undefined || v === null) {
      return 'null';
    }
    if (typeof v === 'number') {
      return v;
    }
    if (typeof v === 'string') {
      return `"${v}"`;
    }
    if (typeof v === 'boolean') {
      return v;
    }
    return `"${v.toString()}"`;
  }).join();
}

