const express = require('express');
const cors = require('cors');
const { login } = require('./loginService');
const jwt = require('jsonwebtoken');
const { checkAuthWithoutError, checkAuth, renewalToken } = require('./authService');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

let corsOptions = {
  origin: ['https://localhost:3000', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

// 현재 토큰이 유효한지 인증만 하고 싶다.
app.get('/token/authorization', checkAuthWithoutError);

app.post('/token/renewal', checkAuth, renewalToken);

app.post('/login', login);

const startServer = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

module.exports = {
  startServer,
};
