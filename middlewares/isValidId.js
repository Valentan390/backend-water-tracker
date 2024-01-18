import { HttpError } from "../helpers/HttpError.js";
import { isValidObjectId } from "mongoose";

const isValidId = (req, res, next) => {
  const { waterId } = req.params;
  if (!isValidObjectId(waterId)) {
    return next(HttpError(404, `${waterId} not valid id`));
  }
  next();
};
export default isValidId;
