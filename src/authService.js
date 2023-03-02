const jwt = require('jsonwebtoken');
const db = require('./database/db');

const tokenIssuer = 'eggs';
const jwtAlgo = 'HS256';

const table_user_info = 'user_info';

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

async function checkAuthFirst(req, res) {
  ret = false;
  msg = '';
  try {
    const token = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (verifyToken(token, process.env.REFRESH_KEY)) {
      const id = jwt.decode(token)['id'];
      await createToken(id, res);
      ret = true;
      msg = 'token is valid';
    } else {
      if (token) {
        msg = 'token is invalid';
      } else {
        msg = 'token is not exist';
      }
    }

    res.json({ success: ret, message: msg });
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

function checkAuth(req, res, next) {
  if (verifyToken(req.cookies[process.env.ACCESS_TOKEN_NAME], process.env.ACCESS_TOKEN_NAME, process.env.ACCESS_KEY)) {
    next();
  } else {
    res.status(401).json();
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
      expiresIn: '5m',
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

async function createToken(id, res) {
  try {
    const rfToken = refreshToken(id);
    await db.execute(`update ${table_user_info} set refresh_token = '${rfToken}' where id = '${id}';`);
    res.cookie(process.env.ACCESS_TOKEN_NAME, accssToken(id), {
      secure: true,
      httpOnly: false,
      overwrite: true,
    });
    res.cookie(process.env.REFRESH_TOKEN_NAME, rfToken, {
      secure: true,
      httpOnly: true,
      overwrite: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
}

async function renewalToken(req, res) {
  try {
    const reqRfToken = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (!verifyToken(reqRfToken, process.env.REFRESH_KEY)) {
      res.status(401).json('refresh token is invalid.');
      return;
    }

    const id = jwt.decode(reqRfToken)['id'];
    const queryRet = await db.execute(`select refresh_token from ${table_user_info} where id = '${id}';`);
    const curRefreshToken = queryRet[0]['refresh_token'];
    if (reqRfToken === curRefreshToken) {
      await createToken(id, res);
      res.status(200).json();
    } else {
      res.status(401).json('do not match refresh token.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  accssToken,
  refreshToken,
  checkAuthFirst,
  checkAuth,
  createToken,
  renewalToken,
};
