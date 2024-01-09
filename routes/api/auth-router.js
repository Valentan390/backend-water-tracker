import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody, isEmptyBody } from "../../middlewares/validateBody.js";

import {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} from "../../models/users.js";

const authRouter = express.Router();

authRouter.post(
  "/signap",
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

export default authRouter;
