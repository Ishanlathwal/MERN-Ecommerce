const express = require("express");

const {
  protectRoutes,
  authorizeRole,
} = require("../Middlewares/authentication_isUSerLoggedIn");

const {
  newOrder,
  myOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/OrderController");

/////////////////////////////////

const router = express.Router();

////////////////////////////////

router.route("/order/new").post(protectRoutes, newOrder);

router.route("/order/:id").get(protectRoutes, getSingleOrder);

router.route("/orders/me").get(protectRoutes, myOrders);

////Admin
router
  .route("/admin/orders")
  .get(protectRoutes, authorizeRole("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .patch(protectRoutes, authorizeRole("admin"), updateOrderStatus)
  .delete(protectRoutes, authorizeRole("admin"), deleteOrder);
module.exports = router;
