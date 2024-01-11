// const express = require('express')

import express from "express";
import { isEmptyBody } from "../../middlewares/isEmptyBody.js";

import watersController from "../../controllers/water-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import isValidId from "../../middlewares/isValidId.js";
import { waterAddSchema, waterUpdateSchema } from "../../models/waters.js";
import validateBody from "../../helpers/validateBody.js";

export const watersRouter = express.Router();

watersRouter.use(authenticate);

// watersRouter.patch("/", watersController.updateWaterById);

// watersRouter.get("/:waterId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

watersRouter.post(
  "/",
  isEmptyBody,
  validateBody(waterAddSchema),
  watersController.addWater
);

watersRouter.put(
  "/:waterId",
  isValidId,
  isEmptyBody,
  validateBody(waterUpdateSchema),
  watersController.updateWaterById
);

watersRouter.delete("/:waterId", isValidId, watersController.deleteWaterById);
// module.exports = router
