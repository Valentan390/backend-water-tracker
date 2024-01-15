import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const emailRegexp = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Set username for user"],
      minlength: 3,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 8,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: emailRegexp,
      unique: true,
    },
    gender: {
      type: String,
      default: "woman",
    },
    dailyNorm: {
      type: Number,
      default: 2000,
    },
    token: {
      type: String,
    },
    avatarURL: {
      type: String,
    },

    verify: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSetting);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(8).max(64).required(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const userUpdateSchema = Joi.object({
  username: Joi.string().min(3),
  email: Joi.string().pattern(emailRegexp),
  newPassword: Joi.string().min(8).max(64),
  oldPassword: Joi.string().min(8).max(64),
  gender: Joi.string().valid("male", "female"),
});

export const userDailyNormaSchema = Joi.object({
  dailyNorm: Joi.number().min(1).max(1500),
});

const User = model("user", userSchema);

export default User;
