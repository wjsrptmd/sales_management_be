const auth = require('./authService');

const login = (req, res) => {
  console.log('login 요청');
  const id = req.body['id'];
  const password = req.body['pw'];
  console.log(id);
  console.log(password);
  // TODO id pw 확인
  let loginSuccess = false;
  let loginMessage = 'login fail';
  if (id === 'QPcSnHi5XAfV0/clZpXqQGys97auUaBKdRhGXy0h9//y5gUvwaS3lGQpVwUCuoA/x1/8FDzQXAMpCdCyPHGWSw==') {
    console.log('salt가 일치 합니다.');
  }

  if (password === 'IqkE0ZyIAO6FJKXaFQ+m626RvBLoPt/xOfwQPoxGHdMAS1Awb+Kh3luaeFKm6ciDdh0nQsH8c9f/F2Pwh7bKXA==') {
    console.log('패스워드가 일치 합니다.');

    auth.sendToken(req, res);
    loginSuccess = true;
    loginMessage = 'login success';
  }

  res.status(200).json({
    success: loginSuccess,
    message: loginMessage,
  });
};

const salt = (req, res) => {
  console.log('salt 요청');
  res.status(200).json({
    salt: 'QPcSnHi5XAfV0/clZpXqQGys97auUaBKdRhGXy0h9//y5gUvwaS3lGQpVwUCuoA/x1/8FDzQXAMpCdCyPHGWSw==', // TODO : db 에서 salt 를 가져와야한다.
  });
};

module.exports = {
  login,
  salt,
};
