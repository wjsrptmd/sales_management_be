const jwt = require('jsonwebtoken');

const tokenIssuer = 'eggs';
const jwtAlgo = 'HS256';

function verifyToken(req, tokenName, secretKey) {
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
}

function checkAuthWithoutError(req, res) {
  console.log('checkAuthWithoutError');
  let authStruct = {
    success: false,
    message: 'token is not valid',
  };

  if (verifyToken(req, process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
    authStruct.success = true;
    authStruct.message = 'token is valid';
  }

  res.json(authStruct);
}

function checkAuth(req, res, next) {
  if (verifyToken(req, process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
    next();
  } else {
    res.status(401).json(error);
  }
}

function accssToken(userId) {
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
}

function refreshToken(userId) {
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
}

function sendToken(req, res) {
  const id = 'ksj';
  res.cookie(process.env.ACCESS_TOKEN_NAME, accssToken(id), {
    secure: true,
    httpOnly: true,
  });
  res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken(id), {
    secure: true,
    httpOnly: true,
  });
}

function renewalToken(req, res) {
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
}

module.exports = {
  checkAuthWithoutError,
  checkAuth,
  sendToken,
  renewalToken,
};
