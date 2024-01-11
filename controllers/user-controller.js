import fs from "fs/promises";
import jimp from "jimp";
import cloudinary from "../helpers/cloudinary.js";
import bcrypt from "bcrypt";

import User from "../models/users.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

const getCurrent = async (req, res) => {
  const { username, email, avatarURL, userdailynorma, gender } = req.user;
  res.json({ username, email, avatarURL, userdailynorma, gender });
};

const updateUserAvatars = async (req, res) => {
  const { _id } = req.user;

  const { public_id: originalPublicId, url: originalPoster } =
    await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
    });

  const resizedPosterPath = `path/to/store/resized_${_id}.webp`;

  const originalImage = await jimp.read(originalPoster);

  await originalImage.resize(250, 250).write(resizedPosterPath);

  await cloudinary.uploader.destroy(originalPublicId);

  await fs.unlink(req.file.path);

  const { url: resizedPoster } = await cloudinary.uploader.upload(
    resizedPosterPath,
    {
      folder: "avatars",
      format: "webp",
    }
  );

  await fs.unlink(resizedPosterPath);

  const updatedUserAvatar = await User.findByIdAndUpdate(_id, {
    avatarURL: resizedPoster,
  });

  res.status(201).json({
    username: updatedUserAvatar.username,
    avatarURL: updatedUserAvatar.avatarURL,
  });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;

  const updateFields = {
    ...req.body,
  };

  if (updateFields.password) {
    updateFields.password = await bcrypt.hash(password, 10);
  }

  const result = await User.findByIdAndUpdate(_id, updateFields);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    result: {
      _id: result._id,
      email: result.email,
      username: result.username,
      avatarURL: result.avatarURL,
      userdailynorma: result.userdailynorma,
      gender: result.gender,
    },
  });
};

export default {
  getCurrent: ctrlWrapper(getCurrent),
  updateUserAvatars: ctrlWrapper(updateUserAvatars),
  updateUser: ctrlWrapper(updateUser),
};
