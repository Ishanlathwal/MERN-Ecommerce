const AppError = require("./Error-Handeling_Class");

// const errorDevelopment = (err, res) => {};

const errorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something Went Wrong",
    });
  }
};

// wrong url error
const handleCastErrorDB = (err) => {
  const message = ` invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// duplicate field error

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];

  const message = `Duplicate field value ${value}. Please enter another value`;

  return new AppError(message, 400);
};

// Validation error

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `  ${errors.join(":-> ")}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // piche se aa rha h too thik h wrna 500
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === "production") {
    // creating deep copy of err
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      // niche 2 m alag se function banane ki gajah direct kr dia

      const message = "JSON Web Token is Invalid please login/sign up again";
      error = new AppError(message, 400);
    }
    if (error.name === "TokenExpiredError") {
      const message = "JSON Web Token Expired please login/sign up again";
      error = new AppError(message, 400);
    }

    errorProd(error, res);
  }
  next();
};
