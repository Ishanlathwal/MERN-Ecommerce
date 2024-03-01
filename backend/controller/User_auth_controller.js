const crypto = require("crypto");
const cloudinary = require("cloudinary");

const AppError = require("../utils/Error-Handeling/Error-Handeling_Class");

const User_Schema = require("../models___Schemas/userSchema");

const catchAsyncError = require("../utils/Error-Handeling/Catch_Async-Errors");

const sendJwtToken = require("../utils/SendJwtToken");

const sendEmail = require("../utils/sendEmail");

// 1) Registration / sighnup

exports.registerUser = catchAsyncError(async (req, res, next) => {
  // profile pic k lia
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password, confirmPassword } = req.body;
  const user = await User_Schema.create({
    name,
    email,
    password,
    confirmPassword,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendJwtToken(user, 201, res); // seprate file to create and send jwt in cookies
});

// 2) login

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please enter email and password", 404));
  }

  const user = await User_Schema.findOne({ email }).select("+password"); // Finding if user exist. password p select false h islia select use.

  if (!user) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password); // compasePass method in schema file. yaha se entered password bhej rhae h

  if (!isPasswordMatched) {
    return next(new AppError("Incorrect email or password", 401));
  }

  sendJwtToken(user, 200, res);
});

// 3) Protect any routes. routes we can access only if we are loggen in

// external file in middleware folder

//  4) logout function. Simply send null as cookie

exports.logoutUser = (req, res) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// 5) Forgot password funcanality. this will send email to user

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User_Schema.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }
  // 2) Generate the random reset token. and save it to db validation off coz we are only saving one field

  const resetToken = user.resetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email Production

  const resetURL = `${req.protocol}://${req.get(
    "host",
  )}/api/v1/users/resetpassword/${resetToken}`;

  // const resetURL = `${process.env.FRONTEND_URL}api/v1/users/resetpassword/${resetToken}`; // for locathost

  const message = `Your password reset token is :-  \n\n ${resetURL} \n\n (valid for only 10 minutes) \n\n if you have not requested to reset your password please ignore this email`;

  try {
    await sendEmail({ email: user.email, sublect: "Password Reset", message }); // ye file utils m h yaha function banaya h

    res.status(200).json({
      status: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (err) {
    // error h too sb reset

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500,
    );
  }
});

// 6) Reset password functionality. when user click on sent email. we can reset the password

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User_Schema.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError("Password do not match", 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendJwtToken(user, 200, res);
});

// Badi file ho gayi this islia baki user_profile.js m
