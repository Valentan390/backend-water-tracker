import express from "express";
import { validateBody, isEmptyBody } from "../../middlewares/validateBody.js";
import watersController from "../../controllers/water-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import isValidId from "../../middlewares/isValidId.js";
import {
  waterVolumeAddSchema,
  waterVolumeUpdateSchema,
} from "../../models/waters.js";
import isValidYearAndMonth from "../../middlewares/isValidYearAndMonth.js";

export const watersRouter = express.Router();

watersRouter.use(authenticate);

watersRouter.get("/userwaterday", watersController.waterUserDay);

watersRouter.get(
  "/userwatermonth/:year/:month",
  isValidYearAndMonth,
  watersController.waterUserMonth
);

watersRouter.post(
  "/",
  isEmptyBody,
  validateBody(waterVolumeAddSchema),
  watersController.addWater
);

watersRouter.patch(
  "/:waterId",
  isValidId,
  isEmptyBody,
  validateBody(waterVolumeUpdateSchema),
  watersController.updateWaterById
);

watersRouter.delete("/:waterId", isValidId, watersController.deleteWaterById);

watersRouter.get("/", watersController.getAll);

export default watersRouter;
