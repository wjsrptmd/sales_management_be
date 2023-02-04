const jwt = require('jsonwebtoken');

const tokenIssuer = 'eggs';
const jwtAlgo = 'HS256';

const verifyToken = (req, tokenName, secretKey) => {
  const token = req.cookies[tokenName];
  let isVerify = false;
  jwt.verify(token, secretKey, { algorithms: jwtAlgo }, (error) => {
    if (error) {
      // console.log(error);
    } else {
      isVerify = true;
    }
  });

  return isVerify;
};

const checkAuthWithoutError = (req, res) => {
  let authStruct = {
    authorized: false,
    message: 'token is not valid',
  };

  if (verifyToken(req, process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
    authStruct.authorized = true;
    authStruct.message = 'token is valid';
  }

  res.json(authStruct);
};

const checkAuth = (req, res, next) => {
  if (verifyToken(req, process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
    next();
  } else {
    res.status(401).json(error);
  }
};

const accssToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      alg: jwtAlgo,
    },
    process.env.ACCESS_KEY,
    {
      expiresIn: '1m',
      issuer: tokenIssuer,
    }
  );
};

const refreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      alg: jwtAlgo,
    },
    process.env.REFRESH_KEY,
    {
      expiresIn: '24h',
      issuer: tokenIssuer,
    }
  );
};

const sendToken = (req, res) => {
  const id = 'ksj';
  res.cookie(process.env.ACCESS_TOKEN_NAME, accssToken(id), {
    secure: true,
    httpOnly: true,
  });
  res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken(id), {
    secure: true,
    httpOnly: true,
  });
};

const renewalToken = (req, res) => {
  if (!verifyToken(req, process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
    res.status(401).json(error);
    return;
  }

  if (!verifyToken(req, process.env.REFRESH_TOKEN_NAME, process.env.REFRESH_KEY)) {
    res.status(401).json(error);
    return;
  }

  // TODO : db 에 저장된 refresh token 과 front 보낸 refresh token 비교.

  sendToken(res, req);
};

module.exports = {
  checkAuthWithoutError,
  checkAuth,
  sendToken,
  renewalToken,
};
