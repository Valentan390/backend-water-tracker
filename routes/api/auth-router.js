import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody, isEmptyBody } from "../../middlewares/validateBody.js";
import authenticate from "../../middlewares/authenticate.js";

import {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} from "../../models/users.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post(
  "/signin",
  isEmptyBody,
  validateBody(userSigninSchema),
  authController.signin
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
