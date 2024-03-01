const express = require("express");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getOneProductDetail,
  createUpdateReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controller/productController");

//////////////////////////////////////////////////

const {
  protectRoutes,
  authorizeRole,
} = require("../Middlewares/authentication_isUSerLoggedIn");

/////////////////////////////

const router = express.Router();

//////////////////////////////////////////////////

router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(protectRoutes, authorizeRole("admin"), getAdminProducts);

router
  .route("/admin/products/new")
  .post(protectRoutes, authorizeRole("admin"), createProduct);

router.route("/products/:id").patch(updateProduct);

router
  .route("/admin/products/:id")
  .patch(protectRoutes, authorizeRole("admin"), updateProduct)
  .delete(protectRoutes, authorizeRole("admin"), deleteProduct);

router.route("/products/:id").get(getOneProductDetail);

router.route("/review").patch(protectRoutes, createUpdateReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(protectRoutes, deleteReview);

module.exports = router;
