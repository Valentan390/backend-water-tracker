import express from "express";

import userController from "../../controllers/user-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import upload from "../../middlewares/upload.js";

const userRouter = express.Router();

userRouter.get("/current", authenticate, userController.getCurrent);

userRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  userController.updateUserAvatars
);

userRouter.put("/update", authenticate, userController.updateUser);

export default userRouter;
