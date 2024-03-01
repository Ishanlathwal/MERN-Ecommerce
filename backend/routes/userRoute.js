const express = require("express");

const router = express.Router();

const {
  protectRoutes,
  authorizeRole,
} = require("../Middlewares/authentication_isUSerLoggedIn");

const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} = require("../controller/User_auth_controller");

const {
  getUserDetails,
  updateMyPassword,
  updateMe,
  getAllUsers,
  getSingleUser,
  updateUserRoleAdmin,
  deleteUserAdmin,
} = require("../controller/user_Profile");

//////////////////////////////////////////////////////////////////////////////

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/forgotpassword").post(forgotPassword);

router.route("/users/resetpassword/:token").patch(resetPassword);

/////////////////////////////////////// after log in routes/ My profile routes

router.route("/me").get(protectRoutes, getUserDetails);

router.route("/user/update").patch(protectRoutes, updateMyPassword);

router.route("/me/update").patch(protectRoutes, updateMe);

/////////////////////////////////////// admin routes

router
  .route("/admin/users")
  .get(protectRoutes, authorizeRole("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(protectRoutes, authorizeRole("admin"), getSingleUser)
  .patch(protectRoutes, authorizeRole("admin"), updateUserRoleAdmin)
  .delete(protectRoutes, authorizeRole("admin"), deleteUserAdmin);

module.exports = router;
