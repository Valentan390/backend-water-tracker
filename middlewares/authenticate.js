import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import User from "../models/users.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const { JWT_SECRET } = process.env;

async function authenticate(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw HttpError(401, "Authorization header not defined");
  }
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    throw HttpError(401);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);
    if (!user || !user.token) {
      throw HttpError(401, "user not found");
    }
    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    throw HttpError(401, error.message);
  }
}

export default ctrlWrapper(authenticate);
