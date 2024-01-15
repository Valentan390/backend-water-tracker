import express from "express";
import { validateBody, isEmptyBody } from "../../middlewares/validateBody.js";
import watersController from "../../controllers/water-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import isValidId from "../../middlewares/isValidId.js";
import { waterAddSchema, waterUpdateSchema } from "../../models/waters.js";

export const watersRouter = express.Router();

watersRouter.use(authenticate);

watersRouter.post(
  "/",
  isEmptyBody,
  validateBody(waterAddSchema),
  watersController.addWater
);

watersRouter.patch(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(waterUpdateSchema),
  watersController.updateWaterById
);

watersRouter.delete("/:id", isValidId, watersController.deleteWaterById);

// -----------------------------------------
watersRouter.get("/", watersController.getAllWaters);
export default watersRouter;
