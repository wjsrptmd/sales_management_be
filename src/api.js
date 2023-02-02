const express = require("express");
const app = express();
const cors = require("cors");
const { login } = require("./loginService");
const jwt = require("jsonwebtoken");

let corsOptions = {
  origin: ["https://localhost:3000", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.cookie("testCookie", "ABCDEF");
  res.json(({message: "테스트 입니다."}));
});

app.post("/login", login);

// app.post('/', (req, res, next) => {
//   const nickname = 'ksj';
//   //jwt.sign(payload, secretOrPrivateKey, [options, callback])
//   accssToken = jwt.sign(
//     {
//       type: 'JWT',
//       id: nickname,
//     },
//     process.env.ACCESS_KEY,
//     {
//       expiresIn: '1m',
//       issuer: '토큰발급자',
//     }
//   );
//   console.log(accssToken);

//   refreshToken = jwt.sign(
//     {
//       type: 'JWT',
//       id: nickname,
//     },
//     process.env.REFRESH_KEY,
//     {
//       expiresIn: '24h',
//       issuer: '토큰발급자',
//     }
//   );

//   res.cookie('accssToken', accssToken, {
//     secure: false,
//     httpOnly: true,
//   });
//   res.cookie('refreshToken', refreshToken, {
//     secure: false,
//     httpOnly: true,
//   });

//   res.status(200).json({
//     code: 200,
//     message: '토큰이 발급되었습니다.',
//   });
// });

const startServer = () => {
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

module.exports = {
  startServer,
};
