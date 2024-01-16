import express from "express";

import userController from "../../controllers/user-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";
import { userUpdateSchema, userDailyNormaSchema } from "../../models/users.js";
import { isEmptyBody, validateBody } from "../../middlewares/validateBody.js";

const userRouter = express.Router();

userRouter.use(authenticate);

userRouter.get("/current", userController.getCurrent);

userRouter.patch(
  "/avatars",
  upload.single("avatar"),
  userController.updateUserAvatars
);

userRouter.patch(
  "/update",
  isEmptyBody,
  validateBody(userUpdateSchema),
  userController.updateUser
);

userRouter.patch(
  "/dailynorm",
  isEmptyBody,
  validateBody(userDailyNormaSchema),
  userController.updateUserDailyNorm
);

export default userRouter;
