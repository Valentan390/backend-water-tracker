import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSetting } from "./hooks.js";
const waterSchema = new Schema(
  {
    milliliters: {
      type: String,
      // required: [true, "Set a count water"],
      // min: 1,
      // max: 1500,
    },
    time: {
      type: String,
      // required: true,
      // max: 5000,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
waterSchema.post("save", handleSaveError);
waterSchema.pre("findOneAndUpdate", addUpdateSetting);
waterSchema.post("findOneAndUpdate", handleSaveError);
export const waterAddSchema = Joi.object({
  milliliters: Joi.string().required(),
  time: Joi.string().required(),
});

export const waterUpdateSchema = Joi.object({
  milliliters: Joi.string().required(),
  time: Joi.string().required(),
});

const Water = model("waters", waterSchema);
export default Water;
