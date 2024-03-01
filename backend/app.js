const express = require("express");
const globalErrorHAndler = require("./utils/Error-Handeling/Error-Controller");
const AppError = require("./utils/Error-Handeling/Error-Handeling_Class");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");

///////////////////////////////////////////////
const app = express();
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}
// app.use(cors());
app.use(cors());
// to set jwt in front end
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept",
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use(
  express.json({
    limit: "50mb",
  }),
);
app.use(cookieParser());

// profile pic
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");
const payment = require("./routes/PaymentsRoutes");

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use("/api/v1", payment);

// To run both front end and backend using one server
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// 1) invalid url

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 2) Global error handler
app.use(globalErrorHAndler);
module.exports = app;
