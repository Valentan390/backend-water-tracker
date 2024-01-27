import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import { nanoid } from "nanoid";

import User from "../models/users.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";
import resetPasswordEmail from "../helpers/resetPasswordEmail.js";

const { JWT_SECRET, BASE_URL } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const avatarURL = gravatar.url(email, { s: "100", r: "x", d: "retro" }, true);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already used");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      username: user.username,
      avatarURL: user.avatarURL,
      dailyNorma: user.dailyNorma,
      gender: user.gender,
    },
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Signout success",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  const resetToken = nanoid();
  const resetTokenExpiration = Date.now() + 3600000;

  const updatedUser = await User.findOneAndUpdate(
    { email },
    {
      resetToken: resetToken,
      resetTokenExpiration: resetTokenExpiration,
    }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found");
  }

  const userName = updatedUser.username;

  const resetLink = `${BASE_URL}/update-password?resetToken=${resetToken}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    html: resetPasswordEmail(BASE_URL, resetLink, userName),
  });

  res
    .status(200)
    .json({ message: "Password reset link has been sent to your email" });
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const currentTimestamp = Date.now();
  const formattedDate = new Date(currentTimestamp).toISOString();

  console.log(formattedDate);
  const updatedUser = await User.findOneAndUpdate(
    {
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    },
    {
      password: hashedPassword,
      resetToken: "",
      resetTokenExpiration: "",
    }
  );

  if (!updatedUser) {
    throw HttpError(400, "Invalid or expired token");
  }

  res.status(200).json({ message: "Password has been reset successfully" });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  forgotPassword: ctrlWrapper(forgotPassword),
  resetPassword: ctrlWrapper(resetPassword),
};
