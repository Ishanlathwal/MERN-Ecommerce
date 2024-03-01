const cloudinary = require("cloudinary");

const AppError = require("../utils/Error-Handeling/Error-Handeling_Class");

const User_Schema = require("../models___Schemas/userSchema");

const Product_Schema = require("../models___Schemas/productSchema");

const catchAsyncError = require("../utils/Error-Handeling/Catch_Async-Errors");

const sendJwtToken = require("../utils/SendJwtToken");

// 1) get user details/ maine login kar lia mrko apni profile dekhni h

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  // note - req.user ye tune protect route m set kr rkha h. Middleware folder m, aur protect route get user detail se phle run hota h too waha se value aati h

  const user = await User_Schema.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// 2) Update my password options. JO profile section m hota change my password

exports.updateMyPassword = catchAsyncError(async (req, res, next) => {
  const user = await User_Schema.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new AppError("Incorrect old password", 400));
  }

  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;

  await user.save();

  sendJwtToken(user, 200, res);
});

// 3) Update my email/ after logged in user

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsyncError(async (req, res, next) => {
  // Create error if user POSTs password data

  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError("This route is not for password updates. ", 400));
  }

  // Filtered out unwanted fields names that are not allowed to be updated

  let filteredBody = filterObj(req.body, "name", "email", "avatar");

  if (req.body.avatar !== "") {
    const user = await User_Schema.find(req.user._id);
    const imageId = user[0].avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    filteredBody.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  // Update user document
  await User_Schema.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// 4) Get all users (admin)

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = await User_Schema.find();

  res.status(200).json({
    success: true,
    user,
  });
});

// 5) Get one user (admin)

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User_Schema.findById(req.params.id);

  if (!user) {
    return next(new AppError(`no user exists with is ${req.parama.id}`, 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// 6) Update user role (admin)

exports.updateUserRoleAdmin = catchAsyncError(async (req, res, next) => {
  // Create error if user POSTs password data

  if (req.body.role) {
    // Filtered out unwanted fields names that are not allowed to be updated

    const filteredBody = filterObj(req.body, "role", "name", "email");

    const findUser = await User_Schema.findById(req.params.id);

    if (!findUser) {
      return next(new AppError("User does not exist"));
    }
    // Update user document

    const user = await User_Schema.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    );

    res.status(200).json({
      success: true,
    });
  } else {
    return next(new AppError("This route is only for role update ", 400));
  }
});

// 7) Delete user (admin)

exports.deleteUserAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User_Schema.findById(req.params.id);

  if (!user) {
    return next(new AppError(404, `User not found with id - ${req.params.id}`));
  }
  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully ",
  });
});
