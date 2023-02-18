const jwt = require('jsonwebtoken');

const tokenIssuer = 'eggs';
const jwtAlgo = 'HS256';

function verifyToken(token, secretKey) {
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
  let authStruct = {
    success: false,
    message: '',
  };

  const token = req.cookies[process.env.ACCESS_TOKEN_NAME];
  if (verifyToken(token, process.env.ACCESS_KEY)) {
    authStruct.success = true;
    authStruct.message = 'token is valid';
  } else {
    if (token) {
      authStruct.message = 'token is invalid';
    } else {
      authStruct.message = 'token is not exist';
    }
  }

  res.json(authStruct);
}

function checkAuth(req, res, next) {
  if (verifyToken(req.cookies[process.env.ACCESS_TOKEN_NAME], process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
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
  if (!verifyToken(req.cookies[process.env.ACCESS_TOKEN_NAME], process.env.ACCESS_KEY)) {
    res.status(401).json(error);
    return;
  }

  if (!verifyToken(req.cookies[process.env.REFRESH_TOKEN_NAME], process.env.REFRESH_KEY)) {
    res.status(401).json(error);
    return;
  }

  // TODO : db 에 저장된 refresh token 과 front 보낸 refresh token 비교.
  sendToken(res, req);
}

module.exports = {
  accssToken,
  refreshToken,
  checkAuthWithoutError,
  checkAuth,
  sendToken,
  renewalToken,
};
