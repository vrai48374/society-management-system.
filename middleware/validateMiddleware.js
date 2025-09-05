import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Pass formatted error to errorHandler
    return next({ errors: errors.array() });
  }
  next();
};
