const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");

const login = (req, res) => {
  const userId = "ksj";

  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  accssToken = jwt.sign(
    {
      id: userId,
    },
    process.env.ACCESS_KEY,
    {
      expiresIn: "1m",
      issuer: "eggs",
    }
  );

  refreshToken = jwt.sign(
    {
      id: userId,
    },
    process.env.REFRESH_KEY,
    {
      expiresIn: "24h",
      issuer: "eggs",
    }
  );

  // token 보내기
  res.cookie("ac", accssToken, {
    secure: true,
    httpOnly: true,
  });
  res.cookie("re", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  // 응답 보내기
  res.status(200).json({
    code: 200,
    message: "토큰이 발급되었습니다.",
  });
};

module.exports = {
  login,
};
