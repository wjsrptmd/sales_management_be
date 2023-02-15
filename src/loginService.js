const auth = require('./authService');
const db = require('./database/db');

function login(req, res) {
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
}

function salt(req, res) {
  console.log('salt 요청');
  res.status(200).json({
    salt: 'QPcSnHi5XAfV0/clZpXqQGys97auUaBKdRhGXy0h9//y5gUvwaS3lGQpVwUCuoA/x1/8FDzQXAMpCdCyPHGWSw==', // TODO : db 에서 salt 를 가져와야한다.
  });
}

function checkDupId(id) {
  return db
    .excuteQuery(`SELECT count(id) FROM user_info WHERE id = '${id}';`)
    .then(function (success, data) {
      console.log('2');
      return true;
    })
    .catch(function (error) {
      // console.log(error);
      return false;
    });
  // if (success) {
  //   // console.log(`data : ${data}`);
  // } else {
  //   // console.log(`throw 입니다.`);
  //   throw new Error(data);
  // }
  // return success;
}

async function signup(req, res) {
  try {
    console.log('signup');
    const id = req.body['id'];
    const pw = req.body['pw'];
    const salt = req.body['salt'];
    // const checkIdResult = await db.execute(`SELECT count(id) FROM user_info WHERE id = '${id}';`);
    const ret = await db.execute(`SELECT * FROM user_info;`);
    console.log(`result : ${ret}}`);

    // db.snedQuery(`INSERT INTO user_info (id, pw, salt) VALUES (${id}, ${pw}, ${salt});`);

    res.status(200).json({
      result: 'success',
      message: 'signup success',
    });
  } catch (err) {
    console.log('error 입니다.');
    res.status(501).json({
      result: 'error',
      message: err,
    });
  }
}

module.exports = {
  login,
  salt,
  signup,
};
