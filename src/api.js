const express = require('express');
const cors = require('cors');
const { login, salt, signup } = require('./loginService');
const jwt = require('jsonwebtoken');
const { checkAuthWithoutError, checkAuth, renewalToken } = require('./authService');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

let corsOptions = {
  origin: ['https://localhost:8080', 'http://localhost:8080'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

// 인증
app.get('/token/authorization', checkAuthWithoutError); // 현재 토큰이 유효한지 인증만 하고 싶다.
app.post('/token/renewal', checkAuth, renewalToken);

// 로그인
app.post('/login', login);
app.get('/login/salt', salt);
app.post('/login/signUp', signup);

const startServer = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

module.exports = {
  startServer,
};
