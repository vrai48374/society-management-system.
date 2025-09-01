import { StatusCodes } from "http-status-codes";

// Runs if route is not found
export function notFound(req, res, next) {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route not found",
  });
}

// Runs if any error is thrown
export function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
