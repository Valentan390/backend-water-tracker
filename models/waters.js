import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const dateRegexp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

const waterSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: [true, "Amount of water is required"],
      minlength: 1,
      maxlength: 500,
    },

    date: {
      type: Date,
      required: true,
      match: dateRegexp,
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

export const waterVolumeAddSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000).required(),
  date: Joi.string().pattern(dateRegexp).required(),
});

export const waterVolumeUpdateSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000),
  date: Joi.string().pattern(dateRegexp),
});

const Water = model("waters", waterSchema);

export default Water;
