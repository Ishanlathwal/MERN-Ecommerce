const express = require("express");
const {
  protectRoutes,
} = require("../Middlewares/authentication_isUSerLoggedIn");
const {
  processPayments,
  sendStripeApi,
} = require("../controller/Payments_Controller");

const router = express.Router();

router.route("/payment/process").post(protectRoutes, processPayments);

router.route("/stripeapikey").get(protectRoutes, sendStripeApi);

module.exports = router;
