const express = require('express');
const cors = require('cors');
const { login } = require('./loginService');
const jwt = require('jsonwebtoken');
const { checkAuth } = require('./authService');
const cookieParser = require('cookie-parser');

const app = express();

let corsOptions = {
  origin: ['https://localhost:3000', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.post('/token', (req, res) => {});

app.post('/login', checkAuth, login);

const startServer = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

module.exports = {
  startServer,
};
