const express = require('express');
const cors = require('cors');
const { login, salt, signup, findUserId } = require('./loginService');
const jwt = require('jsonwebtoken');
const { checkAuthFirst, checkAuth, renewalToken } = require('./authService');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

let corsOptions = {
  origin: true, // 모두 허용.
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

// 인증
app.get('/authorization', checkAuthFirst); // 현재 토큰이 유효한지 인증만 하고 싶다.
app.get('/authorization/renewal', renewalToken);

// 로그인
app.post('/login', login);
app.post('/login/salt', salt);
app.post('/login/signUp', signup);
app.post('/login/id', findUserId);

const startServer = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

module.exports = {
  startServer,
};
