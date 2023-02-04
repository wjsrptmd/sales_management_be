const jwt = require('jsonwebtoken');
const auth = require('./authService');

const login = (req, res) => {
  const userId = 'ksj';

  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  accssToken = jwt.sign(
    {
      id: userId,
    },
    process.env.ACCESS_KEY,
    {
      expiresIn: '1m',
      issuer: 'eggs',
    }
  );

  refreshToken = jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_KEY,
    {
      expiresIn: '24h',
      issuer: 'eggs',
    }
  );

  auth.sendToken(req, res);

  res.status(200).json({
    message: 'ticket is issued normally.',
  });
};

module.exports = {
  login,
};
