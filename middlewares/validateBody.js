import { HttpError } from "../helpers/HttpError.js";

export const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export const isEmptyBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400, "Body must have fields"));
  }
  next();
};
