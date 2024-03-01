const Order_Schema = require("../models___Schemas/orderSchema");
const Product_Schema = require("../models___Schemas/productSchema");
const AppError = require("../utils/Error-Handeling/Error-Handeling_Class");
const catchAsyncError = require("../utils/Error-Handeling/Catch_Async-Errors");

// 1) Create new order

exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order_Schema.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  if (!order) {
    new AppError("Cannot create order");
  }

  res.status(201).json({
    success: true,
    order,
  });
});

// 2) get single order details

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order_Schema.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// 3) get logged in user order details

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order_Schema.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// 4) get all order details Admin

exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order_Schema.find();

  let totalPrice = 0;
  orders.forEach((order) => {
    totalPrice += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalPrice,
    orders,
  });
});

// 5) Update order status -- Admin

exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const orders = await Order_Schema.findById(req.params.id);

  if (orders.orderStatus === "Delivered") {
    return next(new AppError("Already delivered", 400));
  }
  if (req.body.status === "Shipped") {
    orders.orderItems.forEach(async (order) => {
      await updateStock(order.quantity, order.productId);
    });
  }

  orders.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    orders.deliveredAt = Date.now();
  }

  await orders.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(quantity, productId) {
  const product = await Product_Schema.findById(productId.toString());
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// 6) delete order  Admin

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order_Schema.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
