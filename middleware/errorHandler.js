// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let errors = [];

  // Duplicate key error (like email unique)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue);
    errors.push({
      field,
      message: `Duplicate value for field: ${field}`,
    });
  }
  // Validation error (missing fields etc.)
  else if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }
  // Custom error messages (like not found, forbidden, etc.)
  else {
    errors.push({
      message: err.message || "Server Error",
    });
  }

  res.status(statusCode).json({
    success: false,
    errors,
  });
};

export { errorHandler };
