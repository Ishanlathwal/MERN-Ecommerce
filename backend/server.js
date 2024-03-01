const app = require("./app");
const cloudinary = require("cloudinary");

process.on("uncaughtException", (err) => {
  console.log(err.stack);
  console.log("Uncaught Exception Sync Method");

  process.exit(1);
});
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Db connection
const connectDatabase = require("./config/database");

// photo upload
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//config
port = 2000;
const server = app.listen(process.env.Port, () =>
  console.log(`app is running on port${process.env.Port}`),
);
//// final error catching
process.on("unhandledRejection", (err) => {
  console.log(err.stack);
  console.log("Unhandled Rejection Async Method");

  server.close(() => {
    process.exit(1);
  });
});
