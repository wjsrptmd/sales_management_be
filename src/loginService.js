const auth = require('./authService');
const db = require('./database/db');

const table_user_info = 'user_info';

async function login(req, res) {
  try {
    let result = 'success';
    const id = req.body['id'];
    const pw = req.body['pw'];
    const userInfo = await db.execute(`select * from ${table_user_info} where id = '${id}';`);

    if (userInfo.length === 0) {
      result = 'isNotExist';
    } else if (userInfo.length == 1) {
      if (pw !== userInfo[0]['pw']) {
        result = 'passwordFail';
      }
    } else {
      // 같은 id 가 여러개 이다. 일어날 수 없는 상황 이다.
      result = 'error';
    }

    if (result === 'success') {
      const refreshToken = auth.refreshToken(id);
      await db.execute(`update ${table_user_info} set refresh_token = '${refreshToken}' where id = '${id}';`);
      res.cookie(process.env.ACCESS_TOKEN_NAME, auth.accssToken(id), {
        secure: true,
        httpOnly: true,
      });
      res.cookie(process.env.REFRESH_TOKEN_NAME, refreshToken, {
        secure: true,
        httpOnly: true,
      });
    }

    res.status(200).json({
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: 'error',
      message: err,
    });
  }
}

async function salt(req, res) {
  try {
    const id = req.body['id'];
    const userInfo = await db.execute(`select * from user_info where id = '${id}';`);
    const count = userInfo.length;
    if (count == 1) {
      res.status(200).json({
        salt: userInfo[0]['salt'],
      });
    } else if (count == 0) {
      // id 가 없습니다.
      res.status(200).json({
        salt: undefined,
      });
    } else {
      // 같은 id 가 여러개 이다. 일어날 수 없는 상황 이다.
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      result: 'error',
      message: err,
    });
  }
}

async function signup(req, res) {
  try {
    let result = true;
    let message = 'signup success';
    const id = req.body['id'];
    const pw = req.body['pw'];
    const salt = req.body['salt'];
    const queryRet = await db.execute(`SELECT count(*) as cnt FROM user_info WHERE id = '${id}';`);

    const cnt = queryRet[0]['cnt'];
    if (cnt > 0) {
      // TODO : id 중복 warning 표시. dialog
      result = false;
      message = `${id} is already exist`;
    } else {
      await db.execute(`INSERT INTO user_info (id, pw, salt) VALUES ('${id}', '${pw}', '${salt}');`);
      result = true;
    }

    res.status(200).json({
      result: result,
      message: message,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
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
