import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSetting } from "./hooks.js";
const waterSchema = new Schema(
  {
    milliliters: {
      type: Number,
      required: [true, "Set a count water"],
      min: 1,
      max: 1500,
    },
    time: {
      type: Number,
      required: true,
      max: 5000,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
waterSchema.post("save", handleSaveError);
waterSchema.pre("findOneAndUpdate", addUpdateSetting);
waterSchema.post("findOneAndUpdate", handleSaveError);
export const waterAddSchema = Joi.object({
  milliliters: Joi.string(),
  time: Joi.string(),
});

export const waterUpdateSchema = Joi.object({
  milliliters: Joi.string(),
  time: Joi.string(),
});

const Water = model("water", waterSchema);
export default Water;
