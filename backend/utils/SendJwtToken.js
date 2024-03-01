const sendJwtToken = (user, statusCode, res) => {
  const token = user.generateJWT();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    // httpOnly: true,
    // secure: req.secure || req.headers["x-forwarded-proto"] === "https",

    httpOnly: true,
  };

  user.password = undefined;

  res.status(statusCode).cookie("jwt", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendJwtToken;
