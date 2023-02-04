const auth = require('./authService');

const login = (req, res) => {
  console.log(req.body);
  // TODO id pw 확인
  auth.sendToken(req, res);

  res.status(200).json({
    success: true,
    message: 'login success',
  });
};

module.exports = {
  login,
};
