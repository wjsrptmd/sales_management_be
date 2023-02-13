const { startServer } = require('./src/api');
const { connectDb } = require('./src/database/db');

require('dotenv').config();

const start = () => {
  if (!connectDb()) {
    console.log('DB 연결 실패.');
    return;
  }

  startServer();
};

start();
