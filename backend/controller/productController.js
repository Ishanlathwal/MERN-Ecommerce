const Product = require("../models___Schemas/productSchema");
const AppError = require("../utils/Error-Handeling/Error-Handeling_Class");
const catchAsyncError = require("../utils/Error-Handeling/Catch_Async-Errors");
const APIFeatures = require("../utils/api-features-filter-sort-pagination/apiFeature");
const cloudinary = require("cloudinary");

// 1) get all products. ye pagination ki wajah se kia 2 function . query already executed wala error . mern video 7.06

const getProductsQuery = async (req) => {
  const apiFeature = new APIFeatures(Product.find(), req.query)
    .filter()
    .search();

  return await apiFeature.query;
};

exports.getAllProducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 8;

  const productsCount = await Product.countDocuments();

  let product = await getProductsQuery(req);

  let filteredProductsCount = product.length;

  const apiFeature = new APIFeatures(Product.find(), req.query)
    .filter()
    .search()
    .paginate(resultPerPage);

  product = await apiFeature.query;

  res.status(200).json({
    success: true,
    product,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// get all admin products

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const product = await Product.find();
  res.status(200).json({
    success: true,
    product,
  });
});

// 2) get single product detail
exports.getOneProductDetail = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// 3) create product --- only Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.url,
    });
  }

  req.body.images = imagesLink;
  req.body.user = req.user.id; // because we gave reference in product_schema

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// 4) Update product --- only Admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.url,
      });
    }
    req.body.images = imagesLink;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// 5) Delete product --- Admin

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // delete images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: " product deleted successfully",
  });
});

// 6) create/update review

exports.createUpdateReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (res) => res.user.toString() === req.user._id.toString(),
  );

  if (isReviewed) {
    product.reviews.forEach((res) => {
      if (res.user.toString() === req.user._id.toString())
        (res.rating = rating), (res.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((item) => (avg += item.rating));

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

// 7) Get all reviews of all products

exports.getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: true,
    reviews: product.reviews,
  });
});

// 8) Delete Review

exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString(),
  );

  let avg = 0;

  reviews.forEach((item) => (avg += item.rating));

  let ratings;
  if (reviews.length > 0) {
    ratings = avg / reviews.length;
  } else {
    ratings = 0;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    },
  );

  res.status(200).json({
    status: true,
  });
});
