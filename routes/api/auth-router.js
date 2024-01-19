import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody, isEmptyBody } from "../../middlewares/validateBody.js";
import authenticate from "../../middlewares/authenticate.js";

import {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
  userResetPasswordSchema,
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

authRouter.post("/logout", authenticate, authController.signout);

authRouter.post(
  "/restore-password",
  isEmptyBody,
  validateBody(userEmailSchema),
  authController.forgotPassword
);

authRouter.patch(
  "/reset-password",
  isEmptyBody,
  validateBody(userResetPasswordSchema),
  authController.resetPassword
);

export default authRouter;
