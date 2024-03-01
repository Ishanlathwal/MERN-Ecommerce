const catchAsyncError = require("../utils/Error-Handeling/Catch_Async-Errors");
const AppError = require("../utils/Error-Handeling/Error-Handeling_Class");
const jwt = require("jsonwebtoken");
const User_Schema = require("../models___Schemas/userSchema");

// 1) Check if user is loggin to protect routes.

exports.protectRoutes = catchAsyncError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.jwt;
  }
  console.log(req.headers.authorization);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }
  const verifiedData = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User_Schema.findById(verifiedData.id); // verified data m id, iat, exp milti h. Id se user nikal lia

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401,
      ),
    );
  }

  if (currentUser.changedPasswordAfter(verifiedData.iat)) {
    // ye  iat ek value add hoti h jwt.verify se aati h ki token kb issue hua tha. fr wo changedPasswordAfter function m jake compare krte h. schema file m

    return next(
      new AppError("User recently changed password! Please log in again.", 401),
    );
  }

  req.user = currentUser;
  next();
});

// 2) Restrict access only to specific removeListener./ Role based access to routes

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};
