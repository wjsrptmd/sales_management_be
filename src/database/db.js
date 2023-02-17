const mysql = require('mysql2');
let promisePool = undefined;

async function connectDb() {
  let connectResult = false;
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '0803',
      database: 'test_db',
      connectionLimit: 30,
      waitForConnections: true,
    });

    promisePool = pool.promise();
    connectResult = true;
  } catch (err) {
    console.log(err);
  }
  return connectResult;
}

async function execute(query) {
  try {
    const [rows, fields] = await promisePool.query(query);
    return rows;
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  connectDb,
  execute,
};
